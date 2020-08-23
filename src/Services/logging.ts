import { injectable, inject } from "inversify"
import QueueConnector from "../Repositories/queue_connector";

@injectable()
export class LoggingService {
    public async log(level: string, message: string) {
        const queue = await QueueConnector.getConnection();
        if (queue) {
            queue.sendToQueue("Logs", Buffer.from(JSON.stringify({ "level": level, "time": new Date().toISOString(), "log": message })), { persistent: true })
        }
    }
}