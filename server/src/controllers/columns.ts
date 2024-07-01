import {Request, Response, NextFunction} from 'express';
import ColumnModel from '../models/column';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

export const getColumns = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {if(!req.user) {
        return res.status(401);
    }
        const columns = await ColumnModel.find({boardId: req.params.boardId});
        res.send(columns);
    } catch (err) {
        next(err);
    }
}


  