import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';

const app = express();
const httpServer = createServer(app);
const io= new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/register', usersController.register);
app.post('/api/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.getCurrentUser);

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