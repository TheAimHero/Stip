import mongoose from 'mongoose';

const studentAssiSchema = new mongoose.Schema({
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

studentAssiSchema.pre(/^find|save/, function (next) {
  if (process.env.NODE_ENV !== 'development') next();
  this.startTime = Date.now();
  next();
});

studentAssiSchema.post(/^find|save/, function () {
  if (process.env.NODE_ENV !== 'development') return;
  // eslint-disable-next-line no-console
  console.log(`Query took ${Date.now() - this.startTime} milliseconds`);
  return;
});

const studentAssiModel = mongoose.model('StudentAssi', studentAssiSchema);

export default studentAssiModel;
