import React, { useState } from "react";
import "../index.css";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");

  const users = [
    { id: 1, name: "Dr. Samantha Hart" },
    { id: 2, name: "Dr. Michael Trent" },
    { id: 3, name: "Dr. Linda Carter" },
  ];

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    if (!messages[user.id]) {
      setMessages({ ...messages, [user.id]: [] });
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() && selectedUser) {
      setMessages({
        ...messages,
        [selectedUser.id]: [
          ...(messages[selectedUser.id] || []),
          { sender: "You", text: inputMessage },
        ],
      });
      setInputMessage("");
    }
  };

  return (
    <div className="chatbox-container">
      <button className="chatbox-toggle" onClick={toggleChatbox}>
        {isOpen ? "Close Chat" : "Chat"}
      </button>

      {isOpen && (
        <div className="chatbox">
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
                  {messages[selectedUser.id]?.length === 0 ? (
                    <p>Start a conversation with {selectedUser.name}!</p>
                  ) : (
                    messages[selectedUser.id].map((msg, index) => (
                      <div key={index} className="chat-message">
                        <strong>{msg.sender}: </strong>
                        <span>{msg.text}</span>
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
        </div>
      )}
    </div>
  );
};

export default Chatbox;
