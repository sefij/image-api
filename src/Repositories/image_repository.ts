import { injectable } from "inversify";
import { InsertOneWriteOpResult, Int32, UpdateManyOptions, UpdateWriteOpResult } from "mongodb";
import mongoConnector from "./mongodb_connector";
import { ImageDetails } from "../Types/image_details";
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class ImageRepository implements ImageRepository {
    public removeTempImageFiles(uploadDir: string) {
        return fs.readdir(uploadDir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(uploadDir, file), (unlinkArr) => {
                    if (unlinkArr) throw unlinkArr;
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
            return a.result.ok;
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
    public async saveImageDetails(file: ImageDetails) {
        const db = await mongoConnector.getDbInstance();
        if (db) {
            const a: InsertOneWriteOpResult<any> = await db.collection("images").insertOne({ "originalname": file.originalname, "uniquename": file.uniquename, "bucket": file.bucket, "uploadinguser": file.uploadinguser, "uploaddate": new Date(), "isactive": true });
            return a.result.ok;
        }
        else {
            return false;
        }
    }
}