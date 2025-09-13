// server.ts
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);
  io = new Server(httpServer, {
    cors: {
      origin: "*", // change to your frontend domain in production
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("addOnlineUser", (userId) => {
      if (userId && !onlineUsers.has(userId)) {
        onlineUsers.set(userId, { userId, socketId: socket.id });
      }

      console.log("current online users", Array.from(onlineUsers.entries()));

      // broadcast updated online users list
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });

    socket.on("onNotification", (recipientId) => {
      const recipient = onlineUsers.get(recipientId);
      if (recipient) {
        io.to(recipient.socketId).emit("onNotification");
      } else {
        console.log(`User with ID ${recipientId} is not online.`);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((value, key) => {
        if (value.socketId === socket.id) {
          console.log("disconnected", key);
          onlineUsers.delete(key);
        }
      });

      // // update clients after removal
      // io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
