const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const query = groupId ? { groupId } : { userId: req.user._id };

    const activities = await Activity.find(query)
      .populate('userId', 'username')
      .sort({ timestamp: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
};