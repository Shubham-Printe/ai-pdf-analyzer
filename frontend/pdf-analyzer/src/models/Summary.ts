import mongoose, { Schema, models } from 'mongoose';

const SummarySchema = new Schema({
  fileName: String,
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Summary || mongoose.model('Summary', SummarySchema);
