const express = require("express");
const http = require("http") //built in node module. Don't have to install 
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const path = require("path");
require("dotenv").config(); //for deployment

const rooms = {};

io.on("connection", socket =>{
    socket.on("join room", roomID =>{
        if(rooms[roomID])
        {
            rooms[roomID].push(socket.id);
        }
        else
        {
            rooms[roomID] = [socket.id];
        }

        const otherUser = rooms[roomID].find(id => id!== socket.id);

        //check if you are the first user there or not
        if(otherUser)
        {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    //target represents the socket id of the 
    //person you are trying to send the event to
    socket.on("offer", payload =>{
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload =>{
        io.to(payload.target).emit("answer",payload);
    });

    //to make proper connnection
    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});

//for deployment
if(process.env.PROD){
    app.use(express.static(path.join(__dirname, './client/build')));
    app.get('*',(req, res)=>{
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
}

const port = process.env.PORT || 8000;

server.listen(port, ()=> console.log(`server is running on port ${port}`));
