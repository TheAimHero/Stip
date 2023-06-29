import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const profSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: value => validator.isAlpha(value, 'en-US', { ignore: ' ' }),
        message: 'Name should be alphabets only',
      },
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      validate: [validator.isEmail, 'Please enter a valid email'],
    },

    role: { type: String, default: 'prof' },

    UID: {
      type: String,
      required: [true, 'UID is required'],
      unique: [true, 'UID should be unique'],
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
    },

    password: { type: String },

    passwordChangedAt: { type: Date },

    passwordConfirm: { type: String },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

profSchema.virtual('assignments', {
  ref: 'Assignment',
  localField: '_id',
  foreignField: 'createdBy',
});

profSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, process.env.SALT_ROUNDS * 1);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

profSchema.pre(/^find|save/, function (next) {
  if (process.env.NODE_ENV !== 'development') next();
  this.startTime = Date.now();
  next();
});

profSchema.post(/^find|save/, function () {
  if (process.env.NODE_ENV !== 'development') return;
  // eslint-disable-next-line no-console
  console.log(`Query took ${Date.now() - this.startTime} milliseconds`);
  return;
});

const profModel = mongoose.model('Prof', profSchema);

export default profModel;
