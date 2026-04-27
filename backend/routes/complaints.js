const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint, getComplaints, getMyComplaints,
  getComplaintById, upvoteComplaint, updateComplaintStatus,
} = require('../controllers/complaintController');

router.post('/', protect, createComplaint);
router.get('/', getComplaints);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/:id', getComplaintById);
router.put('/:id/upvote', protect, upvoteComplaint);
router.put('/:id/status', protect, authorize('admin'), updateComplaintStatus);

module.exports = router;
