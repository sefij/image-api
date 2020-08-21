import * as minio from 'minio';

class S3Connector {
    static get S3Connector() {
        return this._S3Connector;
    }

    public static async connect() {
        const s3URI = process.env.S3_URI;
        const s3AccessKey = process.env.S3_ACCESS_KEY;
        const s3SecretKey = process.env.S3_SECRET_KEY;
        S3Connector.client = new minio.Client({
            endPoint: s3URI ? s3URI: '',
            port: 9000,
            useSSL: false,
            accessKey: s3AccessKey ? s3AccessKey : '',
            secretKey: s3SecretKey ? s3SecretKey : ''
        });
        return S3Connector.client;
    }

    public static async getConnection() {
        if (this.client != null) {
            return this.client;
        } else {
            await this.connect();
            return this.client;
        }
    }
    private static client: minio.Client | null;
    private static _S3Connector: S3Connector = new S3Connector();
}

export default S3Connector;