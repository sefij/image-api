import { NextFunction, Request, Response } from 'express';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const username = req.headers['x-username'];
    if (!username) {
        res.status(401).json({
            error: 'Unauthorized'
        });
    }
    next();
};

export default authMiddleware;