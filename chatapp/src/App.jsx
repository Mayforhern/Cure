import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// Create socket with explicit connection options
const socketInitializer = () => {
  return io("http://localhost:9000", {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = socketInitializer();
    setSocket(newSocket);

    // Setup connection status handlers
    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      setConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from server. Reason:", reason);
      setConnected(false);
    });

    // Clean up on component unmount
    return () => {
      console.log("Cleaning up socket connection");
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("disconnect");
      newSocket.off("message");
      newSocket.disconnect();
    };
  }, []);

  // Setup message listener
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = (e) => {
    e && e.preventDefault(); // Prevent form submission
    
    if (message.trim() && connected && socket) {
      const newMessage = { text: message.trim() };
      console.log("Sending message:", newMessage);
      socket.emit("user-message", newMessage);
      setMessage("");
      
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.pageContainer}>
        <div style={styles.chatContainer}>
          <div style={styles.headerSection}>
            <h1 style={styles.header}>TeleConnect Chat</h1>
            <div style={styles.connectionStatus}>
              <div style={styles.statusDot(connected)}></div>
              <span style={styles.statusText(connected)}>
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
          
          <div style={styles.chatBox} ref={chatBoxRef}>
            {messages.length === 0 ? (
              <div style={styles.emptyChat}>
                <div style={styles.emptyChatIcon}>💬</div>
                <div>No messages yet. Start a conversation!</div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = index % 2 !== 0;
                return (
                  <div
                    key={index}
                    style={{
                      ...styles.messageRow,
                      justifyContent: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isUser && <div style={styles.avatar}>DR</div>}
                    <div
                      style={{
                        ...styles.message,
                        ...styles.messageType(isUser),
                      }}
                    >
                      {msg.text}
                    </div>
                    {isUser && <div style={{...styles.avatar, ...styles.userAvatar}}>ME</div>}
                  </div>
                );
              })
            )}
          </div>
          
          <form onSubmit={sendMessage} style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={styles.input}
              disabled={!connected}
              ref={inputRef}
            />
            <button 
              type="submit" 
              style={{
                ...styles.sendButton,
                opacity: connected && message.trim() ? 1 : 0.5
              }}
              disabled={!connected || !message.trim()}
            >
              <svg style={styles.sendIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    width: "100%",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "450px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    height: "80vh",
    maxHeight: "700px",
  },
  headerSection: {
    padding: "16px 20px",
    backgroundColor: "#3a67ff",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  header: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  connectionStatus: {
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    fontSize: "0.8rem",
  },
  statusDot: (connected) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: connected ? "#4ade80" : "#ef4444",
    marginRight: "6px",
  }),
  statusText: (connected) => ({
    color: connected ? "#e2ffe2" : "#ffe2e2",
  }),
  chatBox: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#f5f7fb",
  },
  emptyChat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#9ca3af",
    textAlign: "center",
  },
  emptyChatIcon: {
    fontSize: "3rem",
    marginBottom: "10px",
    opacity: "0.7",
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "16px",
    position: "relative",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "18px",
    maxWidth: "70%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    position: "relative",
    wordBreak: "break-word",
  },
  messageType: (isUser) => ({
    backgroundColor: isUser ? "#3a67ff" : "#ffffff",
    color: isUser ? "#ffffff" : "#1f2937",
    borderBottomLeftRadius: isUser ? "18px" : "4px",
    borderBottomRightRadius: isUser ? "4px" : "18px",
    marginRight: isUser ? "8px" : "0",
    marginLeft: isUser ? "0" : "8px",
    boxShadow: isUser 
      ? "0 1px 3px rgba(58, 103, 255, 0.3)" 
      : "0 1px 3px rgba(0, 0, 0, 0.1)",
  }),
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: "bold",
    color: "#6b7280",
  },
  userAvatar: {
    backgroundColor: "#dbeafe",
    color: "#3a67ff",
  },
  inputContainer: {
    display: "flex",
    padding: "12px 16px",
    backgroundColor: "#fff",
    borderTop: "1px solid #f0f0f0",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    outline: "none",
    fontSize: "0.9rem",
    transition: "border-color 0.3s",
    backgroundColor: "#ffffff", // Ensure background is white
    color: "#1f2937", // Ensure text is visible
  },
  sendButton: {
    width: "42px",
    height: "42px",
    marginLeft: "10px",
    backgroundColor: "#3a67ff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s, transform 0.2s",
  },
  sendIcon: {
    width: "20px",
    height: "20px",
    color: "white",
  },
};

export default App;