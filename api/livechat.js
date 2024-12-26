import express from "express";
import ChatModel from "./models/chat.js";

const chatrouter = express.Router();

// Send a message
chatrouter.post("/send", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const chatMessage = new ChatModel({ sender, receiver, message });
    await chatMessage.save();

    res.status(201).json({ success: true, chatMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch chat history between two users
chatrouter.get("/history/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const chatHistory = await ChatModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch all conversations for a user
chatrouter.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await ChatModel.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { receiver: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});
export default chatrouter;
