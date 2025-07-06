const express = require('express');
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', auth, (req, res) => {
  res.json({ _id: req.user._id, username: req.user.username });
});

module.exports = router;
