import mongoose from 'mongoose';

export const studentAssiSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment is required'],
  },

  stauts: {
    type: String,
    enum: {
      values: ['done', 'pending', 'working', 'cancelled'],
      message: 'Status should be either done, pending, working or cancelled',
    },
    default: 'pending',
    required: [true, 'Status is required'],
  },
});
