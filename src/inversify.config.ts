import { Container } from "inversify";
import "reflect-metadata";
import { ImageRepository } from "./Repositories/image_repository";
import { CommonRouter } from "./Routes/common_router";
import { ImageRouter } from "./Routes/image_router";
import { UsageRouter } from "./Routes/usage_router";
import { ImageService } from "./Services/image";
import { RegistrableRouter } from "./Routes/RegistrableRouter";
import TYPES from "./types";
import { UsageService } from "./Services/usage";
import { UsageRepository } from "./Repositories/usage_repository";

const container = new Container();
container.bind<RegistrableRouter>(TYPES.Router).to(ImageRouter);
container.bind<RegistrableRouter>(TYPES.Router).to(UsageRouter);
container.bind<ImageService>(TYPES.ImageService).to(ImageService);
container.bind<UsageService>(TYPES.UsageService).to(UsageService);
container.bind<ImageRepository>(TYPES.ImageRepository).to(ImageRepository);
container.bind<UsageRepository>(TYPES.UsageRepository).to(UsageRepository);

export default container;
