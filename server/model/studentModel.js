import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

import { studentAssiSchema } from '../schemas/studentAssiSchema.js';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    validate: {
      validator: name => validator.isAlpha(name, 'en-US', { ignore: ' ' }),
      message: name => `${name} is not a valid name`,
    },
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: email => validator.isEmail(email),
      message: email => `${email} is not a valid email`,
    },
  },

  rollNo: { type: Number, required: [true, 'Roll No. is required'] },

  PRN: {
    type: String,
    unique: [true, 'PRN already exists'],
    required: [true, 'PRN is required'],
  },

  Photo: { type: String, default: '' },

  password: { type: String, required: [true, 'Password is required'] },

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

  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender should be either Male, Female or Other',
    },
    lowercase: true,
    default: '',
    required: [true, 'Gender is required'],
  },

  assignments: { type: [studentAssiSchema], default: [] },

  subjects: {
    type: [String],
    default: [],
    required: [true, 'Subjects is required'],
  },

  role: { type: String, default: 'student' },

  confirmPassword: { type: String },

  passwordChangedAt: { type: Date, default: Date.now(), required: true },

  announcement: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Announcement',
    default: [],
  },
});

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, process.env.SALT_ROUNDS * 1);
  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

export const studentModel = mongoose.model('Student', studentSchema);
