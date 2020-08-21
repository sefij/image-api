import { UsageRepository } from "../Repositories/usage_repository"
import { injectable, inject } from "inversify"
import TYPES from "../types"

@injectable()
export class UsageService {
    @inject(TYPES.UsageRepository)
    private usageRepository: UsageRepository;
    public async getUsage() {
        return await this.usageRepository.getUsage();
    }
}