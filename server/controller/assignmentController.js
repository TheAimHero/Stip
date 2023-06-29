import assignmentModel from '../model/assignmentModel.js';
import studentModel from '../model/studentModel.js';
import catchAsync from '../utils/catchAsync.js';
import filter from '../utils/filter.js';

export async function addAssignment(req, res) {
  const {
    name,
    class: classId,
    section,
    subject,
    deadline,
    description,
  } = req.body;
  const deadlineDate = Date.parse(deadline);
  if (isNaN(deadlineDate)) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Deadline is not a valid date' });
  }
  // console.log(parseInt(Date.now() / 1e5) * 1e5);
  const docAssignment = {
    name,
    class: classId,
    createdBy: req.user._id,
    section,
    subject,
    deadline: deadlineDate,
    description,
  };
  const assignment = await assignmentModel.create(docAssignment);
  addToStudents(assignment);
  res.status(200).json({ status: 'success', data: { assignment } });
}

async function addToStudents(assignment) {
  await studentModel.updateMany(
    { section: assignment.section, class: assignment.class },
    { $push: { assignments: assignment._id } }
  );
}

export async function getAssignments(req, res, next) {
  // @todo: Sort and filter assignments according to query
  if (req.user.role === 'prof') {
    getAssignmentsProf(req, res, next);
  } else if (req.user.role === 'student') {
    getAssignmentsStudent(req, res, next);
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
    const { query: queryObj } = req;
    const query = assignmentModel.find({ createdBy: req.user._id });
    const { query: modQuery } = new filter(query, queryObj)
      .sortFields()
      .filterQuery()
      .sortBy();
    // @note: pagination
    // .pagination();
    assi = await modQuery;
  }
  res
    .status(200)
    .json({ status: 'success', data: { length: assi.length, assi } });
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
