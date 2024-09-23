import socketio from "socket.io";
import { getUser } from "../services/userService";
import { addNotification } from "../services/notificationService";
let io;

const ioConnect = (http) => {
  io = socketio(http, {
    cors: { origin: `${process.env.FRONTEND_URL}` },
  });

  let users = [];
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    const user = users.find((user) => user.socketId === socketId);
    if (user) updateLastSeen(user?.userId);
    users = users.filter((user) => user.socketId !== socketId);
  };

  const findUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  const getUserInformation = async (userId) => {
    const user = await getUser(userId);
    if (user) return user;
    else return null;
  };

  // Function to send a notification
  const sendNotification = async (receiverId, text) => {
    const notification = await addNotification(receiverId, text);
    const user = findUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getNotification", notification);
    } else {
      console.log("user is not connected");
    }
  };

  io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // When a user comments on something
    socket.on("sendNotification", async ({ userId, text }) => {
      // Replace with logic to determine the owner of the content
      const user = await getUserInformation(userId);

      sendNotification(user, text);
    });

    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

export { ioConnect };
