const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboard, getAllUsers, getAllWorkers, approveWorker, toggleUserActive } = require('../controllers/adminController');
const { getComplaints, updateComplaintStatus } = require('../controllers/complaintController');

// All admin routes are protected
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/workers', getAllWorkers);
router.put('/workers/:id/approve', approveWorker);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/complaints', getComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);

module.exports = router;
