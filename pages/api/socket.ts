import {Server as HttpServer} from "http";
import {Server as NetServer, Socket} from "net";
import {NextApiRequest, NextApiResponse} from "next";
import {Server as ServerIO, Server as SocketIOServer} from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const socket = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    return console.log("Socket is already running");
  }
  console.log("New Socket.io server...✅");

  const httpServer: HttpServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path: "/api/socket",
  });

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
};

export default socket;
