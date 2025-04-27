/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

// import * as Tesseract from 'tesseract.js';
// import pdfParse from 'pdf-parse';

import { connectToDatabase } from '@/lib/mongodb';
import Summary from '@/models/Summary';

export async function POST(req: NextRequest) {

  const formData = await req.formData();
  const file = formData.get('pdf') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Save PDF temporarily
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const tempPath = path.join(tmpdir(), `${uuidv4()}.pdf`);
  await writeFile(tempPath, fileBuffer);

  try {
    // Extract text using OCR
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // @ts-expect-error - ignore this error 
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const { text } = await pdfParse(fileBuffer);

    const safeText = text.slice(0, 6000); // limit to first 6000 characters

    // Summarize using OpenAI
    let summary = "";
    try {

      if (!safeText || safeText.trim().length < 20) {
        return NextResponse.json({ summary: 'This file did not contain enough text to summarize.' });
      }      
      
      const cohereResponse = await cohere.summarize({
        text: safeText,
        length: 'medium',
        format: 'paragraph',
        model: 'command', // or 'command-light'
        extractiveness: 'medium', // or 'high', 'low', 'abstractive', etc.
      });
      
      summary = cohereResponse.summary || "";

      console.log("summary", summary);
      
      
    } catch (error: any) {
      if (error.status === 429) {
        summary = `⚠️ AI quota exceeded. This is a fallback summary.\n\nOriginal text:\n${safeText.slice(0, 500)}...`;
      } else {
        throw error;
      }
    }
    


    // ⬇️ Save to MongoDB here
    await connectToDatabase();
    await Summary.create({
      fileName: file.name,
      summary,
    });


    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
