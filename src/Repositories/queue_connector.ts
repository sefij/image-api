import * as amqp from 'amqplib';

class QueueConnector {
    static get QueueConnector() {
        return this._QueueConnector;
    }

    public static async connect() {
        await amqp.connect(process.env.QUEUE_URI ? process.env.QUEUE_URI : 'amqp://localhost/default').then((connection) => {
            return connection.createChannel().then((channel) => {
                QueueConnector.connection = channel;
            });
        })
        return QueueConnector.connection;
    }

    public static async getConnection() {
        if (this.connection!= null) {
            return this.connection;
        } else {
            await this.connect();
            return this.connection;
        }
    }
    private static connection: amqp.Channel;
    private static _QueueConnector: QueueConnector = new QueueConnector();
}

export default QueueConnector;