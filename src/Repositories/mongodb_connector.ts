import { Db, MongoClient } from "mongodb";

class MongoConnector {
    static get MongoConnector() {
        return this._MongoConnector;
    }

    static async connect() {
        const mongoClient = await MongoClient.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' +
                                                        process.env.MONGO_SERVER + ':' + process.env.MONGO_PORT + '/' + process.env.DB_NAME, { "useUnifiedTopology": true });
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
