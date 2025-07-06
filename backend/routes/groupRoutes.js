const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createGroup,
  getGroupById,
  getMyGroups,
  addMember,
  removeMember,
  deleteGroup,
} = require('../controllers/groupController');

const router = express.Router();

router.post('/', auth, createGroup);

router.get('/:groupId', auth, getGroupById);

router.get('/', auth, getMyGroups);

router.post('/:groupId/members', auth, addMember);

router.delete('/:groupId/members/:memberId', auth, removeMember);

router.delete('/:groupId', auth, deleteGroup);

module.exports = router;
