import { routes } from "./routes";
import "express-async-errors";
import { errorMiddleware } from "./middleware";
import express, { Express } from "express";
import cookieParser from 'cookie-parser';

const app: Express = express();

app.set("view engine", "ejs");

for (const route of routes) {
  route.mountRoutes(app);
}

app.use(cookieParser());
app.use(errorMiddleware);

app.use(function (req, res) {
  res.status(404);
  res.setHeader("Content-type", "text/html");
  res.render("nopage/index");
});

app.listen(3000, () => {
  console.log("[SUCCESS] Started on 3000");
});
