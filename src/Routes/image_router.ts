import { Application, NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import multer from "multer"
import { ImageService } from '../Services/image';
import TYPES from "../types";
import { RegistrableRouter } from "./RegistrableRouter";
import authMiddleware from "../middleware/auth.middleware";
import statsMiddleware from "../middleware/stats.middleware";
import * as path from 'path';
import { LoggingService } from "../Services/logging"
import { Types } from "mongoose";

@injectable()
export class ImageRouter implements RegistrableRouter {
    private imageService: ImageService;
    private loggingService: LoggingService;
    private router: Router = Router();

    constructor(@inject(TYPES.ImageService) imageService: ImageService, @inject(TYPES.LoggingService) loggingService: LoggingService) {
        this.imageService = imageService;
        this.loggingService = loggingService;
    }

    public register(app: Application): void {
        app.use("/api", this.router);
        this.router.get("/image", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            await this.imageService.getImage(req.query.filename, req.headers['x-username']).then((r: any) => {
                if (r) {
                    const name = req.query.filename as string;
                    res.status(200).sendFile(path.join(__dirname, '../../uploads', name));
                    this.imageService.removeTempImageFiles(path.join(__dirname, '../../uploads'));
                    next();
                }
                else {
                    res.status(404).json({ "message": "No image found" });
                    next();
                }
            }).catch((err) => {
                if (err.code) {
                    if (err.code === "NoSuchKey") {
                        res.status(404).json({ "message": "No image found" });
                    }
                    else {
                        res.status(500).json({ "message": "Something Broke :( " });
                    }
                }
                else {
                    if (err === "No image found") {
                        res.status(404).json({ "message": "No image found" });
                    }
                    else {
                        res.status(500).json({ "message": "Something Broke :( " });
                    }
                }
                this.loggingService.log ("error", err.toString() );
                next();
            });
        }, statsMiddleware);
        this.router.get("/imagenames", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            await this.imageService.getAllUserImageNames(req.headers['x-username']).then(r => {
                if (r) {
                    r.toArray().then(a => {
                        if (a.length === 0) {
                            res.status(404).json({ "message": "No image names found" });
                        }
                        else {
                            res.status(200).json(a.map(elem => { return { "filename": elem.originalname, "uploadeddate": elem.uploaddate } }));
                        }
                        next();
                    }).catch((err) => {
                        res.status(500).json({ "message": "Something Broke :( " });
                        this.loggingService.log ("error", err.toString() );
                        next();
                    });
                }
                else {
                    res.status(500).json({ "message": "Something Broke :( " });
                    next();
                }
            }).catch((err) => {
                res.status(500).json({ "message": "Something Broke :( "});
                this.loggingService.log ("error", err.toString() );
                next();
            });
        });
        this.router.post('/image', authMiddleware, multer({ dest: "./uploads/" }).single("upload"), (req: Request, res: Response, next: NextFunction) => {
            this.imageService.uploadImage(req.file, req.headers['x-username'], req.body.overwrite).then((whatever) => {
                if (whatever) {
                    res.status(200).json({ "message": "Image saved successfully" });;
                    this.imageService.removeTempImageFiles(path.join(__dirname, '../../uploads'));
                    next();
                }
                else {
                    res.status(500).json({ "message": "Something Broke :( " });
                    next();
                }
            }).catch((err) => {
                res.status(500).json({ "message": "Something Broke :( "});
                this.loggingService.log ("error", err.toString() );
                next();
            });
        }, statsMiddleware);
        this.router.delete('/image', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
            this.imageService.removeImage(req.query.filename, req.headers['x-username']).then((whatever) => {
                if (whatever) {
                    res.status(200).json({ "message": "Image deleted successfully" });
                    next();
                }
                else {
                    res.status(500).json({ "message": "Something Broke :( " });
                    next();
                }
            }).catch((err) => {
                if (err === 'No image found') {
                    res.status(404).json({ "message": err });
                }
                else {
                    res.status(500).json({ "message": "Something Broke :( "});
                }
                this.loggingService.log ("error", err.toString() );
                next();
            });
        }, statsMiddleware);
    }
}