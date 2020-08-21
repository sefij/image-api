export class ImageDetails {
    originalname: string;
    uniquename: string;
    bucket: string;
    uploadinguser: string;
    uploaddate: Date;
    isactive: boolean;
    constructor(originalname: string, uniquename: string, bucket: string, uploadinguser: string, uploaddate: Date, isactive: boolean) {
        this.originalname = originalname;
        this.uniquename = uniquename;
        this.bucket = bucket;
        this.uploadinguser = uploadinguser;
        this.uploaddate = uploaddate;
        this.isactive = isactive;
    }
}