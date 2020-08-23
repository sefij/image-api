import { Application, NextFunction, Request, Response, Router } from "express";
import { RegistrableRouter } from './RegistrableRouter';
import { inject, injectable } from "inversify";
import { UsageService } from '../Services/usage';
import TYPES from "../types";
import authMiddleware from "../middleware/auth.middleware";
import { LoggingService } from "../Services/logging"

@injectable()
export class UsageRouter implements RegistrableRouter {
   private usageService: UsageService;
   private loggingService: LoggingService;
   private router: Router = Router();

   constructor(@inject(TYPES.UsageService) usageService: UsageService) {
      this.usageService = usageService;
   }

   public register(app: Application): void {
      app.use("/api", this.router);
      this.usageService.getUsage();
      this.router.get("/usage", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
         await this.usageService.getUsage().then(r => {
            if (r) {
               res.status(200).json(r);
               next();
            }
            else {
               res.status(404).send('Failure accessing usage report');
               next();
            }
         }).catch((err) => {
            res.status(400).send('Failure  accessing usage report');
            this.loggingService.log ("error", err.toString() );
            next();
         });;
      });
   }
}