const express = require('express');
const auth = require('../middleware/authMiddleware');
const { getActivities } = require('../controllers/activityController');

const router = express.Router();

router.get('/', auth, getActivities);

router.get('/:groupId', auth, getActivities);

module.exports = router;

