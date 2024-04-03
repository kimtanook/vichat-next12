import {Server} from "socket.io";

const socket = async (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("New Socket.io server...✅");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("Connect!!");
      socket.on("join_room", ({roomName, userName}) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
      });
      socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
      });
      socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
      });
      socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default socket;
