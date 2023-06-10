import * as auth from './authController.js';
import * as generic from './genericController.js';
import * as authUtils from '../utils/authUtils.js';
import { studentModel } from '../model/studentModel.js';
import { assignmentModel } from '../model/assignmentModel.js';

async function updateAssi(req, user) {
  const assigns = await assignmentModel.find(
    { section: req.body.section, class: req.body.class },
    { _id: 1 }
  );
  assigns.forEach(assi => user.assignments.push({ assignment: assi }));
  user.save();
  return user;
}

export async function signup(req, res, next) {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Passwords do not match' });
  }

  if (!authUtils.checkStrongPassword(password)) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Password is too weak' });
  }

  req.body.role = undefined;
  let student = await studentModel.create(req.body);
  student = await updateAssi(req, student);
  const token = authUtils.signToken(student._id);
  authUtils.addCookie(res, token);

  res.status(201).json({ status: 'success', token, data: { student } });
}

export const login = auth.login(studentModel);

export const getMe = generic.getMe(studentModel);

export const updatePassword = auth.updatePassword(studentModel);

export const protect = auth.protect(studentModel);

export const restrict = auth.restrict('student');

export async function deleteMe(req, res, next) {
  await studentModel.deleteOne({ email: req.body.email });
  res.status(200).json({ status: 'success', data: {} });
}
