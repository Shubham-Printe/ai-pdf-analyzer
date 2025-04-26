import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Summary from '@/models/Summary';

export async function GET() {
  try {
    await connectToDatabase();
    const summaries = await Summary.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(summaries);
  } catch (error) {
    console.error('[GET /api/summaries]', error);
    return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
  }
}
