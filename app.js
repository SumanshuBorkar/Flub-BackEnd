const express = require("express");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRouter = require("./router/userRouter");
const PostRouter = require("./router/postsRouter");
const chatRouter = require("./router/ChatRouter");
const messageRouter = require("./router/MessageRouter");

app.use("/user", UserRouter);
// app.use(middleBare); // Apply the authentication middleware here
app.use("/posts", PostRouter);

app.use("/chat" ,chatRouter);

app.use("/message" ,messageRouter);

module.exports = app;
