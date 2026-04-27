const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createRequest, getMyRequests, getWorkerRequests, updateStatus } = require('../controllers/serviceController');

router.post('/request', protect, authorize('user'), createRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/worker-requests', protect, authorize('worker'), getWorkerRequests);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
