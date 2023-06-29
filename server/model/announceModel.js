import mongoose from 'mongoose';

const announceSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },

  date: { type: Date, required: true, default: Date.now },

  senderName: { type: String, required: [true, 'senderName is required'] },

  senderId: { type: String, required: [true, 'senderId is required'] },
  class: {
    type: String,
    required: [true, 'Class is required'],
    enum: { values: ['FE', 'SE', 'TE', 'BE'], message: 'Invalid Class' },
  },

  subject: { type: String },

  section: {
    type: [String],
    required: [true, 'Section is required'],
    enum: {
      values: ['A', 'B', 'C', 'D', 'E', 'F'],
      message: 'Section should be either A, B, C, D, E or F',
    },
  },
  message: { type: String, required: [true, 'Message is required'] },
});

const announceModel = mongoose.model('Announcement', announceSchema);

export default announceModel;
