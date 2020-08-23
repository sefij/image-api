import { injectable } from "inversify";
import QueueConnector from '../Repositories/queue_connector';
import { UsageReport } from '../Types/usage_report'
import { Dictionary } from "../Types/dictionary";
import { stringify } from "uuid";

@injectable()
export class UsageRepository implements UsageRepository {
    private usageReport: UsageReport = new UsageReport(0, {}, {}, {});
    public async getUsage() {
        this.listenForStatsFromQueue();
        return this.usageReport;
    }
    public async listenForStatsFromQueue() {
        const queue = await QueueConnector.getConnection();
        queue.consume('GET-image', async (msg) => {
            if (msg) {
                const msgUser :string = await JSON.parse(msg.content.toString()).user;
                const tempDictionary : Dictionary = {};
                tempDictionary[msgUser] = this.usageReport.imagesViewed[msgUser]? this.usageReport.imagesViewed[msgUser]+1: 1;
                this.usageReport.imagesViewed[msgUser] = tempDictionary[msgUser];
            }
        });
        queue.consume('POST-image', async (msg) => {
            if (msg) {
                this.usageReport.totalImages++;
                const msgUser :string = await JSON.parse(msg.content.toString()).user;
                const tempDictionary : Dictionary = {};
                tempDictionary[msgUser] = this.usageReport.imagesUploaded[msgUser]? this.usageReport.imagesUploaded[msgUser]+1: 1;
                this.usageReport.imagesUploaded[msgUser] = tempDictionary[msgUser];
            }
        });
        queue.consume('DELETE-image', async (msg) => {
            if (msg) {
                const msgUser :string = await JSON.parse(msg.content.toString()).user;
                const tempDictionary : Dictionary = {};
                tempDictionary[msgUser] = this.usageReport.imagesDeleted[msgUser]? this.usageReport.imagesDeleted[msgUser]+1: 1;
                this.usageReport.imagesDeleted[msgUser] = tempDictionary[msgUser];
            }
        });
    }
}