import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import application from './app.js';
dotenv.config();

const port = process.env.PORT || 8080;
const server = http.createServer(application);

mongoose.connect(process.env.DB_URL).then(() => {
  console.log('DB connection successful');
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
