import { Db, MongoClient } from "mongodb";

class MongoConnector {
    static get MongoConnector() {
        return this._MongoConnector;
    }

    static async connect() {
        const mongoURI = process.env.MONGO_URI;
        const mongoClient = await MongoClient.connect(mongoURI ? mongoURI : '', {"useUnifiedTopology": true});
        MongoConnector.db = mongoClient.db(process.env.DB_NAME);
        return MongoConnector.db;
    }


    public static async getDbInstance() {
        if (this.db != null) {
            return this.db;
        } else {
            await this.connect();
            return this.db;
        }
    }
    private static db: Db;
    private static _MongoConnector: MongoConnector = new MongoConnector();
}

export default MongoConnector;
