const expressAsyncHandler = require( 'express-async-handler' );
const Chat = require( "./../model/ChatModel" );
const User = require( '../model/userModel' );

const accessChat = expressAsyncHandler( async ( req, res ) => {
    const { userId } = req.body;

    if ( !userId )
    {
        console.log( "UserId param not sent with request" );
        return res.sendStatus( 400 );
    }

    var isChat = await Chat.find( {
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    } )
        .populate( "users", "-password" )
        .populate( "latestMessages" );

    isChat = await User.populate( isChat, {
        path: "latestMessages.sender",
        select: "Name file email"
    } );

    if ( isChat.length > 0 )
    {
        res.send( isChat[0] );
    } else
    {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try
        {
            const createdChat = await Chat.create( chatData );

            const FullChat = await Chat.findOne( { _id: createdChat._id } ).populate(
                "users",
                "-password"
            );

            res.status( 200 ).send( FullChat );
        } catch ( e )
        {
            res.status( 400 );
            throw new Error( e.message );
        }
    }
} )

const fetchChat = expressAsyncHandler( async ( req, res ) => {
    try
    {
        Chat.find( { users: { $elemMatch: { $eq: req.user._id } } } )
            .populate( "users", "-password" )
            .populate( "groupAdmin", "-password" )
            .populate( "latestMessages" )
            .sort( { updateAt: -1 } )
            .then( async ( results ) => {
                results = await User.populate( results, {
                    path: "latestMessages.sender",
                    select: "Name file email"
                } );
                res.status( 200 ).send( results );
            } );
    } catch ( e )
    {
        res.status( 400 );
        throw new Error( e.message );
    }
} );

const createGroup = expressAsyncHandler(async (req, res) =>{

    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "please fill all the fields"})
    }   

    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);
    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id})
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

            res.status(200).json(fullGroupChat);

    }catch(e){
            res.status(400);
            throw new Error(e.message);
    }
})

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName, users } = req.body;
  
    try {
      // Check if the chat exists
      const chat = await Chat.findById(chatId);
      if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
      }
  
      // Update the chat name and users
      chat.chatName = chatName;
      chat.users = users;
  
      // Save the updated chat
      const updatedChat = await chat.save();
  
      res.json(updatedChat);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

const addToGroup = expressAsyncHandler(async (req, res) => {
    const {chatId, userId} = req.body;
    const added = await  Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId},
        },
        { new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        res.status(404);
        throw new Error("Chat not found");
    }else{
        res.json(added);
    }
})

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId},
        },
        { new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!removed){
        res.status(404);
        throw new Error("Chat not found");
    }else{
        res.json(removed);
    }
})


module.exports = { accessChat , fetchChat, createGroup, renameGroup, addToGroup, removeFromGroup};