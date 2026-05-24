const Message = require('../models/Message');

// GET CHAT HISTORY BETWEEN TWO USERS
exports.getMessages = async (req, res) => {
    try {
        const myId = req.user.id; // Logged-in user
        const otherUserId = req.params.userId; // The person they are chatting with

        // Find all messages where I am the sender AND they are the receiver
        // OR where they are the sender AND I am the receiver.
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        }).sort('timestamp'); // Sort by oldest to newest

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching messages" });
    }
};