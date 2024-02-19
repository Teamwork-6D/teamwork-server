import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

import application from "./app.js";

const port = process.env.PORT | 8080;
const server = http.createServer(application);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
