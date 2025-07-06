const express=require("express");
const cors=require("cors")
const {Server}=require("socket.io");
const http = require("http");
require("dotenv").config();
const { connection } = require("./config/db");
const { userRoute } = require("./routes/userRoute");
const { bookingRoutes } = require("./routes/bookingRoute");

const app=express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.get("/",(req,res)=>{
    res.send("Welcome to Home Route")
}) 

app.use("/user",userRoute)
app.use("/booking",bookingRoutes)

app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/:room",(req,res)=>{
  res.render('room',{roomId: req.params.room});
});

const roomUsers = {};

io.on("connection", (socket) => {
  socket.on('joinRoom', (roomId, userId) => {
    socket.join(roomId);
    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    roomUsers[roomId].push(userId);

    // Send all existing users to the new user (except themselves)
    const otherUsers = roomUsers[roomId].filter(id => id !== userId);
    socket.emit('allUsers', otherUsers);

    // Notify others
    socket.broadcast.to(roomId).emit('userConnected', userId);

    socket.on('chatMessage', ({ roomId, message }) => {
      socket.broadcast.to(roomId).emit('chatMessage', { message });
    });

    socket.on('disconnect', () => {
      roomUsers[roomId] = (roomUsers[roomId] || []).filter(id => id !== userId);
      socket.broadcast.to(roomId).emit('userDisconnected', userId);
    });
  });
});

httpServer.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to DB");
        console.log(`Server is runnning at port ${process.env.port}`)
    } catch (error) {
        console.log("Not able to connect to DB");
        console.log(error);
    }
})

