import crypto from 'crypto'
import ErrorResponse from '../utils/error.util'
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@btffamily/tmat';

import NotificationHelper from '../middleware/notify.mw'
import Notification from '../models/Notification.model'

export const pushEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers);

    const all = await Notification.find({});
    const notif = new NotificationHelper(res);
    notif.push(all);

})


