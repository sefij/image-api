import { Dictionary } from "./dictionary";

export class UsageReport {
    imagesViewed: Dictionary;
    totalImages: number;
    imagesUploaded: Dictionary;
    imagesDeleted: Dictionary;
        constructor(totalImages: number, imagesViewed: Dictionary,  imagesUploaded: Dictionary, imagesDeleted: Dictionary) {
            this.imagesViewed = imagesViewed;
            this.totalImages = totalImages;
            this.imagesUploaded = imagesUploaded;
            this.imagesDeleted = imagesDeleted;
    }
}