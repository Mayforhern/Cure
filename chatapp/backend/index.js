const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

// Apply CORS middleware with specific configuration
app.use(cors({
  origin: "*", // Allow all origins during development
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.static(path.join(__dirname, "public")));

// Configure Socket.IO with CORS options
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins during development
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
    console.log("A user connected with ID:", socket.id);
    
    // Send a welcome message to the newly connected client
    socket.emit("message", { sender: "Doctor", text: "Welcome to the chat! How can I help you today?" });
    
    socket.on("user-message", (message) => {
        console.log("Received message:", message);
        io.emit("message", message); // Broadcast message to everyone
        
        // Doctor auto-replies after 2 seconds
        // setTimeout(() => {
        //     io.emit("message", { sender: "Doctor", text: "How can I assist you?" });
        // }, 2000);
    });
    
    socket.on("disconnect", () => {
        console.log("User disconnected with ID:", socket.id);
    });
});

server.listen(9000, "0.0.0.0", () => {
    console.log("Server is running on port 9000");
    console.log("Access at http://localhost:9000");
});