import * as amqp from 'amqplib';

class QueueConnector {
    static get QueueConnector() {
        return this._QueueConnector;
    }

    public static async connect() {
        const queueURI = process.env.QUEUE_URI;
        await amqp.connect(queueURI ? queueURI : 'amqp://localhost').then((connection) => {
            return connection.createChannel().then((channel) => {
                QueueConnector.connection = channel;
            });
        })
        return QueueConnector.connection;
    }

    public static async getConnection() {
        if (this.connection != null) {
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