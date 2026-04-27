const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getWorkers,
  getWorkerById,
  getMyWorkerProfile,
  updateWorkerProfile,
  updateAvailability,
} = require('../controllers/workerController');

router.get('/', getWorkers);
router.get('/my-profile', protect, authorize('worker'), getMyWorkerProfile);
router.put('/my-profile', protect, authorize('worker'), updateWorkerProfile);
router.put('/availability', protect, authorize('worker'), updateAvailability);
router.get('/:id', getWorkerById);

module.exports = router;
