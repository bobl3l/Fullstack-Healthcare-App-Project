import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  date: { type: Date, required: true },
  msg: { type: String, required: true },
});

// Export model
const ChatModel = mongoose.model("chat", ChatSchema);
export default ChatModel;
