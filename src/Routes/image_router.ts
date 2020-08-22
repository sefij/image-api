import { Application, NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import multer from "multer"
import { ImageService } from '../Services/image';
import TYPES from "../types";
import { RegistrableRouter } from "./RegistrableRouter";
import authMiddleware from "../middleware/auth.middleware";
import statsMiddleware from "../middleware/stats.middleware";
import * as path from 'path';

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
            await this.imageService.getImage(req.query.filename, req.headers['x-username']).then((r: any) => {
                if (r) {
                    const name = req.query.filename as string;
                    res.status(200).sendFile(path.join(__dirname, '../../uploads', name));
                    this.imageService.removeTempImageFiles(path.join(__dirname, '../../uploads'));
                    next();
                }
                else {
                    res.status(404).json({ "message": "Failure downloading" });
                    next();
                }
            }).catch((err) => {
                if (err.code) {
                    if (err.code === "NoSuchKey") {
                        res.status(404).json({ "message": "No image found" });
                    }
                    else {
                        res.status(500).json({ "message": "Failure downloading" });
                    }
                }
                else {
                    res.status(500).json({ "message": "Failure downloading" });
                }
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
                    }).catch(() => {
                        res.status(500).json({ "message": "Something Broke :( " });
                        next();
                    });
                }
                else {
                    res.status(500).json({ "message": "Something Broke :( " });
                    next();
                }
            }).catch((err) => {
                res.status(500).json({ "message": "Failure getting image names", "error": err });
                next();
            });
        });
        this.router.post('/image', authMiddleware, multer({ dest: "./uploads/" }).single("upload"), (req: Request, res: Response, next: NextFunction) => {
            this.imageService.uploadImage(req.file, req.headers['x-username']).then((whatever) => {
                if (whatever) {
                    res.status(200).json({ "message": "Image saved successfully" });;
                    this.imageService.removeTempImageFiles(path.join(__dirname, '../../uploads'));
                    next();
                }
                else {
                    res.status(500).json({ "message": "Failure uploading" });
                    next();
                }
            }).catch((err) => {
                res.status(500).json({ "message": "Something Broke :( "});
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
                    res.status(500).json({ "message": "Failure deleting" });
                    next();
                }
            }).catch((err) => {
                if (err === 'No image found') {
                    res.status(404).json({ "message": err });
                }
                else {
                    res.status(500).json({ "message": "Something Broke :( ", "error": err });
                }
                next();
            });
        }, statsMiddleware);
    }
}