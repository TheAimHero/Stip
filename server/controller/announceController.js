import announceModel from '../model/announceModel.js';

export async function getAnnouncement(req, res) {
  const announcements = await announceModel.find();
  res.status(200).json({
    success: true,
    data: announcements,
  });
}

export async function addAnnouncement(req, res) {
  const { title, subject, section, class: className, message } = req.body;
  const { name: senderName, _id: senderId } = req.user;
  // prettier-ignore
  const docBody = { title, section, class: className, subject, senderId, senderName, message };
  const announcement = await announceModel.create(docBody);
  res.status(200).json({
    success: true,
    data: { announcement },
  });
}
