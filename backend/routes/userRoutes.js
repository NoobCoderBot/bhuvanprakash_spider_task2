const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends,
  addFriend,
  removeFriend,
} = require('../controllers/userController');

const router = express.Router();

router.get('/search', auth, searchUsers);

router.post('/friends/request', auth, sendFriendRequest);

router.get('/friend-requests', auth, getFriendRequests);

router.post('/friend-requests/respond', auth, respondToFriendRequest);

router.get('/friends', auth, getFriends);
router.post('/add/:id', auth, addFriend);        
router.delete('/remove/:id', auth, removeFriend);

module.exports = router;
