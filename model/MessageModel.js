const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat", // Corrected model name to "Chat"
    },
  },
  {
    timestamps: true, // Corrected option name
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
