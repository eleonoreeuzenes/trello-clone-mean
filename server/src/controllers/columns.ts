import {Request, Response, NextFunction} from 'express';
import ColumnModel from '../models/column';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { Server } from 'socket.io';
import { Socket } from '../types/socket.interface';
import { SocketEventsEnum } from '../types/socketEvents.enum';
import  { getErrorMessage } from '../helpers'

export const getColumns = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {if(!req.user) {
        return res.status(401);
    }
        const columns = await ColumnModel.find({boardId: req.params.boardId});
        res.send(columns);
    } catch (err) {
        next(err);
    }
};

export const createColumn = async (io: Server, socket: Socket, data: {boardId: string, title: string}) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventsEnum.columnsCreateFailure, 'User is not authorized');
            return;
        }
        const newColumn = new ColumnModel({
            title: data.title,
            userId: socket.user.id,
            boardId: data.boardId,
        });
        const savedColumn = await newColumn.save();
        io.to(data.boardId).emit(SocketEventsEnum.columnsCreateSuccess, savedColumn);
        console.log('server socket io createColumn', savedColumn);
    } catch (err) { 
        socket.emit(SocketEventsEnum.columnsCreateFailure, getErrorMessage(err));
}
};


  