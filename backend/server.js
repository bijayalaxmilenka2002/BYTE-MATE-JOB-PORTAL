const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message'); 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ THE FIX: Make the uploads folder publicly readable so employers can view the PDFs!
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log("Database connection error: ", err));

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Make sure this path is correct
app.use('/api/network', require('./routes/connectionRoutes'));

// Add these missing lines back!
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
console.log("✅ Job routes successfully loaded!");

// Quick route to fetch chat history for a specific user
app.get('/api/messages/:otherUserId', async (req, res) => {
    try {
        // NOTE: If you have auth middleware, apply it here to get req.user.id safely. 
        // For simplicity, passing both IDs in the query/params or decoding token is needed.
        // Assuming your frontend passes token, you'd protect this route. 
        // IF THIS FAILS, you need to add your authMiddleware and use req.user.id!
        const messages = await Message.find({
            $or: [
                { sender: req.headers['userid'], receiver: req.params.otherUserId },
                { sender: req.params.otherUserId, receiver: req.headers['userid'] }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching messages" });
    }
});

// WEBSOCKET LOGIC
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (userId) => {
        socket.join(userId);
    });

    socket.on('send_message', async (data) => {
        try {
            const { senderId, receiverId, content } = data;
            const newMessage = new Message({
                sender: senderId,
                receiver: receiverId,
                content: content
            });
            await newMessage.save();
            io.to(receiverId).emit('receive_message', newMessage);
        } catch (error) {
            console.error("Error saving live message:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server and Live Chat are running on port ${PORT}`);
});