const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// Make uploads folder publicly readable and ensure it exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB Atlas (uses environment variable with safe fallback)
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log("Database connection error: ", err));

// Healthcheck routes for Render/Cloud monitoring
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'ByteMate API & Live Chat Server' });
});
app.get('/health', (req, res) => res.status(200).send('OK'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/network', require('./routes/connectionRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
console.log("Job routes successfully loaded!");

// Quick route to fetch chat history for a specific user
app.get('/api/messages/:otherUserId', async (req, res) => {
    try {
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
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server and Live Chat are running on port ${PORT}`);
});
