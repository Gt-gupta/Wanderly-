const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./api/authRoutes');
const userRoutes = require('./api/userRoutes');
const postRoutes = require('./api/postRoutes');
const getRoutes = require('./api/getRoutes');
const deleteRoutes = require('./api/deleteRoutes');
const path = require("path");
const multer = require('multer');
const fs = require('fs');
const http = require('http');
const {Server} = require('socket.io');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST' , 'DELETE'],
        credentials: true,
    },
});
app.use(bodyParser.json());
const cors = require('cors');

require('dotenv').config();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // React app URL during development
    credentials: true, // Include cookies if necessary
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post',postRoutes);
app.use('/get',getRoutes);
app.use('/delete',deleteRoutes);

io.on('connection', (socket) => {
    // Listen for the 'joinRoom' event
    socket.on('joinRoom', (roomId) => {
        // Add the client (socket) to the specified room
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Listen for sending messages
    socket.on('sendMessage', (data) => {
        const { chatId, senderId, message } = data;

        // Broadcast the message to everyone in the room except the sender
        socket.to(chatId).emit('receiveMessage', {
            senderId,
            message,
            chatId,
        });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
    });
});



// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = {app , io};
// create table likes(id int , postId int, userId int , primary key(id) , foreign key(postId) references posts(id) , foreign key (userId) references users(id));