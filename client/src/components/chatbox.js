import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace with the currently logged-in user's ID if logged in
  const loggedInUserId = isLoggedIn ? "currentUserId" : null;

  const users = [
    { id: "user1", name: "Dr. Samantha Hart" },
    { id: "user2", name: "Dr. Michael Trent" },
    { id: "user3", name: "Dr. Linda Carter" },
  ];

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    if (!messages[user.id]) {
      setLoading(true);
      try {
        const response = await axios.get(
          `/chat/history/${loggedInUserId}/${user.id}`
        );
        setMessages({
          ...messages,
          [user.id]: response.data.map((msg) => ({
            sender: msg.sender === loggedInUserId ? "You" : user.name,
            text: msg.message,
            timestamp: new Date(msg.timestamp).toLocaleString(),
          })),
        });
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() && selectedUser) {
      const newMessage = {
        sender: loggedInUserId,
        receiver: selectedUser.id,
        message: inputMessage,
      };

      try {
        const response = await axios.post("/chat/send", newMessage);

        setMessages({
          ...messages,
          [selectedUser.id]: [
            ...(messages[selectedUser.id] || []),
            {
              sender: "You",
              text: response.data.chatMessage.message,
              timestamp: new Date(
                response.data.chatMessage.timestamp
              ).toLocaleString(),
            },
          ],
        });
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chatbox-container">
      <button className="chatbox-toggle" onClick={toggleChatbox}>
        {isOpen ? "Close Chat" : "Chat"}
      </button>

      {isOpen && (
        <div className="chatbox">
          {!isLoggedIn ? ( // Show login message if user is not logged in
            <div className="chatbox-login-prompt">
              <p>Login to start chatting.</p>
            </div>
          ) : (
            <>
              <div className="chatbox-sidebar">
                <ul>
                  {users.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className={selectedUser?.id === user.id ? "active" : ""}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="chatbox-main">
                {selectedUser ? (
                  <>
                    <div className="chatbox-header">
                      <h3>Chat with {selectedUser.name}</h3>
                    </div>
                    <div className="chatbox-body">
                      {loading ? (
                        <p>Loading chat history...</p>
                      ) : messages[selectedUser.id]?.length === 0 ? (
                        <p>Start a conversation with {selectedUser.name}!</p>
                      ) : (
                        messages[selectedUser.id].map((msg, index) => (
                          <div key={index} className="chat-message">
                            <strong>{msg.sender}: </strong>
                            <span>{msg.text}</span>
                            <span className="timestamp">
                              {" "}
                              ({msg.timestamp})
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="chatbox-footer">
                      <input
                        type="text"
                        placeholder={`Message ${selectedUser.name}...`}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button onClick={sendMessage}>Send</button>
                    </div>
                  </>
                ) : (
                  <div className="chatbox-select-prompt">
                    <p>Select a user to start chatting</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbox;
