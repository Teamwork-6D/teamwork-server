import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import {
  createColumn,
  deleteColumn,
  updateColumn,
} from './controllers/column.js';
import { createTask, deleteTask, updateTask } from './controllers/task.js';

import application from './app.js';
import Column from './models/column.js';
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

io.on('connection', (socket) => {
  console.log('User connected to socket');

  socket.on('join-project', (projectData) => {
    const { _id } = projectData;
    socket.join(_id);
    socket.on('new-column', async (columnData) => {
      const res = await createColumn(columnData);
      if (res) {
        socket.emit('new-column-success');
      }
    });

    socket.on('delete-column', async (columnData) => {
      const res = await deleteColumn(columnData);
      if (res) {
        socket.emit('delete-column-success');
      }
    });

    socket.on('edit-column', async (columnData) => {
      const res = await updateColumn(columnData);
      if (res) {
        socket.emit('edit-column-success');
      }
    });

    socket.on('new-task', async (taskData) => {
      const newTaskData = {
        title: taskData.title,
        about: taskData.about,
        dueDate: taskData.dueDate,
        projectId: taskData.project._id,
        columnId: taskData.column._id,
        column: taskData.column,
        user: taskData.user,
        project: taskData.project,
      };
      const res = await createTask(newTaskData);
      await Column.findByIdAndUpdate(taskData.column._id, {
        $addToSet: { tasksOrder: res._id },
      });

      if (res) {
        socket.emit('new-task-success');
      }
    });

    socket.on('delete-task', async (taskData) => {
      const res = await deleteTask(taskData);

      if (res) {
        socket.emit('delete-task-success');
      }
    });

    socket.on('edit-task', async (taskData) => {
      const res = await updateTask(taskData);

      if (res) {
        socket.emit('edit-task-success');
      }
    });

    socket.on('disconnect', () => {
      socket.leave(_id);
      io.in(_id).emit('user-left', socket.id);
    });
  });
});
