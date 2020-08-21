import { NextFunction, Request, Response } from 'express';

function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    if(!error.status || error.status < 100 || error.status > 600) {
        error.status = 500
    }
    response.status(error.status).json(error);
}

export default errorMiddleware;