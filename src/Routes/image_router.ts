import { Application, NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import multer from "multer"

import { ImageService } from '../Services/image';
import TYPES from "../types";
import { RegistrableRouter } from "./RegistrableRouter";
import authMiddleware from "../middleware/auth.middleware";
import statsMiddleware from "../middleware/stats.middleware";

@injectable()
export class ImageRouter implements RegistrableRouter {
    private imageService: ImageService;
    private router: Router = Router();

    constructor(@inject(TYPES.ImageService) imageController: ImageService) {
        this.imageService = imageController;
    }

    public register(app: Application): void {
        app.use("/api", this.router);
        this.router.get("/image", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            await this.imageService.getImage(req.query.filename, req.query.pathtosaveto, req.headers['x-username']).then(r => {
                if (r) {
                    res.status(200).send('success');
                    next();
                }
                else {
                    res.status(404).send('Failure downloading');
                    next();
                }
            }).catch(() => {
                res.status(400).send('Failure downloading');
                next();
            });
        }, statsMiddleware );
        this.router.get("/imagenames", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            await this.imageService.getAllUserImageNames(req.headers['x-username']).then(r => {
                if (r) {
                    r.toArray().then(a => {
                        res.status(200).send(a.map(elem => { return { "filename": elem.originalname, "uploadeddate": elem.uploaddate } }));
                        next();
                    }).catch(() => {
                        res.status(400).send('Something Broke :( ');
                        next();
                    });
                }
                else {
                    res.status(400).send('Something Broke :( ');
                    next();
                }
            }).catch(() => {
                res.status(400).send('Something Broke :( ');
                next();
            });
        });
        this.router.post('/image', authMiddleware, multer({ dest: "./uploads/" }).single("upload"), (req: Request, res: Response, next: NextFunction) => {
            this.imageService.uploadImage(req.file, req.headers['x-username']).then((whatever) => {
                if (whatever) {
                    res.status(200).send('success');
                    this.imageService.removeTempImageFiles("./uploads/");
                    next();
                }
                else {
                    res.status(400).send('Failure uploading');
                    next();
                }
            }).catch(() => {
                res.status(400).send('Something Broke :( ');
                next();
            });
        }, statsMiddleware);
        this.router.delete('/image', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
            this.imageService.removeImage(req.query.filename, req.headers['x-username']).then((whatever) => {
                if (whatever) {
                    res.status(200).send('success');
                    next();
                }
                else {
                    res.status(400).send('Failure uploading');
                    next();
                }
            }).catch(() => {
                res.status(400).send('Something Broke :( ');
                next();
            });
        }, statsMiddleware);
    }
}