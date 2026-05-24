const User = require('../models/User');

exports.sendRequest = async (req, res) => {
    try {
        const senderId = req.user.id; 
        const receiverId = req.params.userId; 

        if (senderId === receiverId) return res.status(400).json({ message: "You cannot send a request to yourself." });

        const receiver = await User.findById(receiverId);
        if (!receiver) return res.status(404).json({ message: "User not found." });

        if (receiver.connections.includes(senderId)) return res.status(400).json({ message: "Already connected." });
        if (receiver.pendingRequests.includes(senderId)) return res.status(400).json({ message: "Request already sent." });

        receiver.pendingRequests.push(senderId);
        await receiver.save();
        res.status(200).json({ message: "Request sent!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.acceptRequest = async (req, res) => {
    try {
        const receiverId = req.user.id; 
        const senderId = req.params.userId; 

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        receiver.pendingRequests = receiver.pendingRequests.filter(id => id.toString() !== senderId);

        if (!receiver.connections.includes(senderId)) {
            receiver.connections.push(senderId);
            sender.connections.push(receiverId);
        }

        await receiver.save();
        await sender.save();
        res.status(200).json({ message: "Accepted!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.declineRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const senderId = req.params.userId;
        const receiver = await User.findById(receiverId);
        
        receiver.pendingRequests = receiver.pendingRequests.filter(id => id.toString() !== senderId);
        await receiver.save();
        res.status(200).json({ message: "Declined." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMyNetwork = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('connections', 'name role email')
            .populate('pendingRequests', 'name role email');
        res.status(200).json({ connections: user.connections, pendingRequests: user.pendingRequests });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSuggestedUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const hiddenUsers = [req.user.id, ...user.connections, ...user.pendingRequests];
        const suggested = await User.find({ _id: { $nin: hiddenUsers } }).select('name role email');
        res.status(200).json(suggested);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching suggestions" });
    }
};