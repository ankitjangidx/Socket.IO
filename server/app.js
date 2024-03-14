import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin:"*"
    }
});
const port = 3000;
app.use(cors())

io.on("connection", (socket) => { 
    console.log("a user connected");
    console.log("socket", socket.id)
    // socket.emit("message", "hello world")
    // socket.broadcast.emit("message", `${socket.id} join ed the server`)
    // when using to then we can use socket.on or io.on it is same 
    socket.on("message", ({message,room}) => { 
        console.log(message, room)
        //send to entire circuit 
        // io.emit("received-data", msg)
        // send to other socket than actual sent one 
        // socket.broadcast.emit("received-data", msg)
        // send to room number 
        io.to(room).emit("received-data", message);
    })
    socket.on("join-room", (room) => {
        socket.join(room)
        console.log("inside join-room")
    })
})

app.get("/", (req, res) => { 
    res.send("<h1>hello world</h1>")
})
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
