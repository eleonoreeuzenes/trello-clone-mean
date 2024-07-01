import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Socket } from './types/socket.interface';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
import { SocketEventsEnum } from './types/socketEvents.enum';
import jwt from 'jsonwebtoken';
import { secret } from './config';
import User from './models/user';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
}
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/api/register', usersController.register);
app.post('/api/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.getCurrentUser);
app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard);
app.post("/api/boards", authMiddleware, boardsController.createBoard);


mongoose.set('toJSON', {
    virtuals: true,
    transform: (_, converted) => {
        delete converted._id;
    }
});

io.use(async(socket: Socket, next) => {
    try {
        const token = (socket.handshake.auth.token as string) ?? "";
        const data = jwt.verify(token.split(' ')[1], secret) as {
            id: string;
            email: string;
        };
        const user = await User.findById(data.id);

        if(!user) {
            return next(new Error('Authentication error'));
        }
        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    socket.on(SocketEventsEnum.boardsJoin, (data) => {
        boardsController.joinBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsLeave, (data) => {
        boardsController.leaveBoard(io, socket, data);
    });
});

mongoose.connect('mongodb://localhost:27017/trello').then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(4001, () => {
        console.log('listening on *:4001');
    });
}).catch((error) => {
    console.log('Error connecting to MongoDB', error);
});