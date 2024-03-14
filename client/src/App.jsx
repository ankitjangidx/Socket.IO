import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, TextField, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [receivedMessages, setreceivedMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketid, setSocketid] = useState("");
  const [roomName, setroomName] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketid(socket.id);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    socket.on("message", (message) => {
      console.log(message);
    });
    socket.on("received-data", (data) => {
      console.log("data", data);

      setreceivedMessages((receivedMessages) => [...receivedMessages, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    console.log("receivedMessages", receivedMessages);
  }, [receivedMessages]);

  const Handler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinroom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName)
    setroomName("")
  }
  return (
    <Container maxWidth="sm">
      <Typography variant="h3" color="initial" gutterBottom>
        Welcome to Socket.IO
      </Typography>
      <Typography variant="h5" color="initial" gutterBottom>
        {socketid}
      </Typography>
      <form onSubmit={joinroom}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          label="Type your roomname here"
          value={roomName}
          onChange={(e) => setroomName(e.target.value)}
        />
        <Button type="submit" variant="outlined" color="primary">
          join
        </Button>
      </form>
      <form onSubmit={Handler}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          label="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          variant="outlined"
          label="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="outlined" color="primary">
          send
        </Button>
      </form>
      {receivedMessages.map((data, index) => (
        <Typography variant="h5" color="initial" gutterBottom key={index}>
          {data}
        </Typography>
      ))}
    </Container>
  );
}

export default App;
