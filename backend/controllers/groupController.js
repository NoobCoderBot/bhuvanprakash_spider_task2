const Group = require('../models/Group');
const Activity = require('../models/Activity');

exports.createGroup = async (req, res) => {
  const { name, members = [] } = req.body;

  if (!name) return res.status(400).json({ error: 'Group name is required' });

  try {
    const group = await Group.create({
      name,
      creator: req.user._id,
      members: [req.user._id, ...members],
    });

     await Activity.create({
  userId: req.user._id,
  groupId: group._id, 
  description: `you created the group ${group.name}`,
});

    res.status(201).json(group);
  } catch (err) {
    console.error('[Create Group Error]', err);
    res.status(500).json({ error: 'Could not create group' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members', 'username');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json(group);
  } catch (err) {
    console.error('[Get Group Error]', err);
    res.status(500).json({ message: 'Could not retrieve group' });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).populate('members', 'username');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get groups' });
  }
};

exports.addMember = async (req, res) => {
  const groupId = req.params.groupId;
  const { memberId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can add members' });
    }

    if (!group.members.includes(memberId)) {
      group.members.push(memberId);
      await group.save();
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add member' });
  }
};

exports.removeMember = async (req, res) => {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can remove members' });
    }

    group.members = group.members.filter(
      (id) => id.toString() !== memberId
    );

    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

exports.deleteGroup = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can delete the group' });
    }

    await Activity.create({
      userId: req.user._id,
      groupId: group._id,
      description: `You deleted the group "${group.name}"`,
    });

    await group.deleteOne();

    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error('[Delete Group Error]', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

