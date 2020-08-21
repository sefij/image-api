import { Application, Request, Response, Router, NextFunction } from 'express';
import { injectable } from 'inversify';
import { RegistrableRouter } from './RegistrableRouter';

@injectable()
export class CommonRouter implements RegistrableRouter {
   private router: Router = Router();

   public register(app: Application): void {
      app.use("/", this.router);
      this.router.all('*', (req: Request, res: Response, next: NextFunction) => {
         res.status(404).send({ error: true, message: 'Invalid URL, check your URL please' });
      });
   }
}