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
                const i :string = await JSON.parse(msg.content.toString()).user;
                const ob : Dictionary = {};
                ob[i] = this.usageReport.imagesViewed[i]? this.usageReport.imagesViewed[i]+1: 1;
                this.usageReport.imagesViewed[i] = ob[i];
            }
        });
        queue.consume('POST-image', async (msg) => {
            if (msg) {
                this.usageReport.totalImages++;
                const i :string = await JSON.parse(msg.content.toString()).user;
                const ob : Dictionary = {};
                ob[i] = this.usageReport.imagesUploaded[i]? this.usageReport.imagesUploaded[i]+1: 1;
                this.usageReport.imagesUploaded[i] = ob[i];
            }
        });
        queue.consume('DELETE-image', async (msg) => {
            if (msg) {
                const i :string = await JSON.parse(msg.content.toString()).user;
                const ob : Dictionary = {};
                ob[i] = this.usageReport.imagesDeleted[i]? this.usageReport.imagesDeleted[i]+1: 1;
                this.usageReport.imagesDeleted[i] = ob[i];
            }
        });
    }
}