import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';

const app = express();
const httpServer = createServer(app);
const io= new Server(httpServer);

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', () => {   
    console.log('socket connect');
});

mongoose.connect('mongodb://localhost:27017/trello').then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(4001, () => {
        console.log('listening on *:4001');
    });
}).catch((error) => {
    console.log('Error connecting to MongoDB', error);
});