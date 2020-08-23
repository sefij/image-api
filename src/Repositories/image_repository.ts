import { injectable } from "inversify";
import { InsertOneWriteOpResult, UpdateWriteOpResult } from "mongodb";
import mongoConnector from "./mongodb_connector";
import { ImageDetails } from "../Types/image_details";
import * as fs from 'fs';
import * as path from 'path';
import { LoggingService } from "../Services/logging"

@injectable()
export class ImageRepository implements ImageRepository {
    private loggingService: LoggingService;
    public removeTempImageFiles(uploadDir: string) {
        return fs.readdir(uploadDir, (err, files) => {
            if (err) this.loggingService.log ("error", err.toString() );
            for (const file of files) {
                fs.unlink(path.join(uploadDir, file), (unlinkErr) => {
                    if (unlinkErr) this.loggingService.log ("error", unlinkErr.toString() );
                });
            }
        });
    }
    public async getUserImageNames(user: string) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            return db.collection("images").find({ "uploadinguser": user, "isactive": true });
        }
        else {
            return false;
        }
    }
    public async updateImageDetails(detail: ImageDetails) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            const a: UpdateWriteOpResult = await db.collection("images").updateOne({ "originalname": detail.originalname, "uniquename": detail.uniquename, "bucket": detail.bucket, "uploadinguser": detail.uploadinguser, "uploaddate": detail.uploaddate }, { $set: { "isactive": true } });
            return (a.result.ok === 1 && a.result.nModified > 0);
        }
        else {
            return false;
        };
    }
    public async updateMultipleImagesToInactive(user: any, originalname: any, bucket: any) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            const a: UpdateWriteOpResult = await db.collection("images").updateMany({ "originalname": originalname,"bucket": bucket, "uploadinguser": user }, { $set: { "isactive": false } });
            return (a.result.ok === 1 && a.result.nModified > 0);
        }
        else {
            return false;
        };
    }
    public async markImageAsDeleted(uniquename: string) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            const a: UpdateWriteOpResult = await db.collection("images").updateOne({ "uniquename": uniquename,}, { $set: { "isactive": false } });
            return (a.result.ok === 1 && a.result.nModified > 0);
        }
        else {
            return false;
        };
    }
    public async getImageUniqueName(filename: any, user: any) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            return await db.collection("images").findOne({ "originalname": filename, "isactive": true, "uploadinguser": user });
        }
        else {
            return false;
        }
    }
    public async saveImageDetails(file: ImageDetails, overwrite: boolean) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            const a: InsertOneWriteOpResult<any> = await db.collection("images").insertOne({ "originalname": file.originalname, "uniquename": file.uniquename, "bucket": file.bucket, "uploadinguser": file.uploadinguser, "uploaddate": new Date(), "isactive": true });
            return (a.result.ok === 1 && a.result.n > 0);
        }
        else {
            return false;
        }
    }
}