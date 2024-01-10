import { Express, json, Router } from "express";
import jwt from 'jsonwebtoken'
require('dotenv').config

export default abstract class Route {
  abstract setPrefix(): string;

  viewRouter = Router();
  apiRouter = Router();
  cssRouter = Router();
  adminRouter = Router();
  constructor() {
    this.apiRouter.use(json(), (req, res, next) => {
      res.setHeader("Content-type", "application/json");
      next();
    });
    this.viewRouter.use((req, res, next) => {
      res.setHeader("Content-type", "text/html");
      next();
    });
    this.cssRouter.use((req, res, next) => {
      res.setHeader("Content-type", "text/css");
      next();
    });
    this.adminRouter.use((req, res, next) => {
      if (req.cookies && req.cookies.token) {
        const token = JSON.parse(req.cookies.token as unknown as string);
        jwt.verify(token.token, process.env.SECRET, (error, data: any) => {
          if (error) {
            res.status(401);
            res.render('/administration/login');
          } else {
            res.locals.data = data;
            next();
          }
        });
      } else {
        console.log(req.cookies)
        res.status(401);
        res.render('/administration/login');
      }
    });
  }

  public mountRoutes(app: Express) {
    this.initializeRoutes();
    console.log("[SYSTEM] Mounted route " + this.setPrefix());
    app.use(this.setPrefix(), this.viewRouter);
    app.use(this.setPrefix(), this.apiRouter);
    app.use(this.setPrefix(), this.cssRouter);
    app.use(this.setPrefix(), this.adminRouter);
  }

  protected abstract initializeRoutes(): void;
}
