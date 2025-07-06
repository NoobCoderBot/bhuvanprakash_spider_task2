const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Search query is missing' });

  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user._id }
    }).select('username');

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

exports.sendFriendRequest = async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username is required' });

  try {
    const recipient = await User.findOne({ username });
    if (!recipient) return res.status(404).json({ error: 'User not found' });

    if (
      recipient.friendRequests.includes(req.user._id) ||
      recipient.friends.includes(req.user._id)
    ) {
      return res.status(400).json({ error: 'Already requested or friends' });
    }

    recipient.friendRequests.push(req.user._id);
    await recipient.save();

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('[SendFriendRequest Error]', err);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friendRequests', 'username');
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch friend requests' });
  }
};

exports.respondToFriendRequest = async (req, res) => {
  const { requesterId, accept } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    if (accept) {
      user.friends.push(requesterId);
      requester.friends.push(user._id);
      await requester.save();
    }

    await user.save();

    res.json({ message: accept ? 'Friend request accepted' : 'Friend request declined' });
  } catch (err) {
    console.error('[RespondToFriendRequest Error]', err);
    res.status(500).json({ error: 'Failed to respond to request' });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch friends' });
  }
};

exports.addFriend = async (req, res) => {
  const friendId = req.params.id;

  if (friendId === req.user._id.toString()) {
    return res.status(400).json({ error: "You can't add yourself" });
  }

  try {
    const friend = await User.findById(friendId);
    if (!friend) return res.status(404).json({ error: 'User not found' });

    if (req.user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Already friends' });
    }

    req.user.friends.push(friendId);
    await req.user.save();
    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding friend' });
  }
};

exports.removeFriend = async (req, res) => {
  const friendId = req.params.id;
  try {
    req.user.friends = req.user.friends.filter(id => id.toString() !== friendId);
    await req.user.save();
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ error: 'Error removing friend' });
  }
};
