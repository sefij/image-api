import { NextFunction, Request, Response } from 'express';
import QueueConnector from '../Repositories/queue_connector';

async function statsMiddleware(req: Request, res: Response, next: NextFunction) {
    const queue = await QueueConnector.getConnection();
    const method = req.method;
    const func = req.url.split('?')[0].substring(1);
    const user = req.headers['x-username'];
    const responseStatusCode = res.statusCode;
    if (method && func && user) {
        queue.sendToQueue(method + '-' + func, Buffer.from(JSON.stringify({ "date": new Date().toISOString(), "method": method, "function": func, "user": user, "response_code": responseStatusCode })), { persistent: true })
    } else {
        // next();
    }
};

export default statsMiddleware;