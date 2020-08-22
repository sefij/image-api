import { injectable, inject } from "inversify"
import { v4 as uuid } from 'uuid';
import TYPES from "../types"
import S3Connector from "../Repositories/s3_connector"
import "reflect-metadata";
import { ImageRepository } from "../Repositories/image_repository"
import { ImageDetails } from "../Types/image_details";
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class ImageService {
    @inject(TYPES.ImageRepository)
    private imageRepository: ImageRepository;
    public async getAllUserImageNames(user: any) {
        return this.imageRepository.getUserImageNames(user);
    }
    public async uploadImage(file: any, user: any) {
        const os = await S3Connector.getConnection();
        if (os) {
            const filedetails = new ImageDetails(file.originalname, uuid(), "data", user, new Date(), true);
            return Promise.all([this.imageRepository.saveImageDetails(filedetails), os.fPutObject(filedetails.bucket, filedetails.uniquename, file.path, {})]);
        }
        else {
            return false;
        }
    }
    public async removeImage(filename: any, user: any) {
        const os = await S3Connector.getConnection();
        if (os) {
            return this.imageRepository.getImageUniqueName(filename, user)
                .then(name => {
                    if (name) {
                        return Promise.all([os.removeObject(name.bucket, name.uniquename).then((details: any) => {
                            return true;
                        }).catch((err) => {
                            // console.log(err);
                            return [false, err];
                        }), this.imageRepository.markImageAsDeleted(name.uniquename)])
                    }
                    else {
                        return Promise.reject('No image found');
                    }
                });
        }
        else {
            return false;
        }
    }
    public async getImage(filename: any, user: any) {
        const os = await S3Connector.getConnection();
        if (os) {
            return await this.imageRepository.getImageUniqueName(filename, user)
                .then(name => {
                    if (name) {
                        return os.getObject('data', name.uniquename).then((strm) => {
                            const dest = path.join(__dirname, '../../uploads', filename);
                            const writeStream = fs.createWriteStream(dest);
                            return new Promise((resolve, reject) => {
                                strm.on("error", () => reject);
                                writeStream.on("error", reject);
                                writeStream.on("finish", () => resolve(dest));
                                strm.pipe(writeStream);
                            });
                        }).catch((err) => {
                            return Promise.reject(err);
                        })
                    }
                    else {
                        return Promise.reject('No image found');
                    }
                })
        }
        return 'false';
    }
    public async updateImage(detail: ImageDetails) {
        const os = await S3Connector.getConnection();
        if (os) {
            return this.imageRepository.updateImageDetails(detail);
        }
        else {
            return false;
        }
    }
    public removeTempImageFiles(uploadDir: string) {
        return this.imageRepository.removeTempImageFiles(uploadDir);
    }
}