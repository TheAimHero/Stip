import mongoose from 'mongoose';

export const assignmentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Prof' },

  createdAt: { type: Date, default: Date.now },

  class: {
    type: String,
    required: [true, 'Class is required'],
    enum: { values: ['FE', 'SE', 'TE', 'BE'], message: 'Invalid Class' },
  },

  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: {
      values: ['A', 'B', 'C', 'D', 'E', 'F'],
      message: 'Section should be either A, B, C, D, E or F',
    },
  },

  modifiedAt: { type: Date, default: Date.now },

  path: { type: String },

  subject: { type: String, required: [true, 'Subject is required'] },

  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function (val) {
        return val > this.createdAt;
      },
      message: 'Deadline is in the past',
    },
  },

  cancelled: { type: Boolean, default: false },

  description: { type: String },
});

assignmentSchema.pre('save', function (next) {
  if (!this.isModified()) next();
  this.modifiedAt = Date.now();
  next();
});

const assignmentModel = mongoose.model('Assignment', assignmentSchema);

export default assignmentModel;
