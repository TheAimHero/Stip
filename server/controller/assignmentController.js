import { assignmentModel } from '../model/assignmentModel.js';
import { studentModel } from '../model/studentModel.js';
import { catchAsync } from '../utils/catchAsync.js';

export async function addAssignment(req, res) {
  req.body.createdBy = req.user._id;
  const assignment = await assignmentModel.create(req.body);
  addToStudents(assignment);
  res.status(200).json({ status: 'success', data: { assignment } });
}

async function addToStudents(assignment) {
  await studentModel.updateMany(
    { section: assignment.section, class: assignment.class },
    { $push: { assignments: { assignment: assignment._id } } }
  );
}

export async function getAssignments(req, res, next) {
  // TODO: Sort and filter assignments according to query
  if (req.user.role === 'prof') {
    await getAssignmentsProf(req, res, next);
  } else if (req.user.role === 'student') {
    await getAssignmentsStudent(req, res, next);
  }
}

const getAssignmentsStudent = catchAsync(async (req, res, next) => {
  const assiArr = req.user.assignments.map(assignment => assignment.assignment);
  const assi = await assignmentModel.find({ _id: { $in: assiArr } });
  res.status(200).json({ status: 'success', data: { assi } });
});

const getAssignmentsProf = catchAsync(async (req, res, next) => {
  let assi;
  if (req.body.ids) {
    assi = await assignmentModel.find({
      _id: { $in: req.body.ids },
      createdBy: req.user._id,
    });
  } else {
    assi = await assignmentModel.find({ createdBy: req.user._id });
  }
  res.status(200).json({ status: 'success', data: { assi } });
});

export async function deleteAssignment(req, res) {
  if (req.body.ids) {
    await assignmentModel.deleteMany({
      _id: { $in: req.body.ids },
      createdBy: req.user._id,
    });
  } else {
    await assignmentModel.deleteMany({ createdBy: req.user._id });
  }
  res.status(200).json({ status: 'success', data: {} });
}
