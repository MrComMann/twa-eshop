//soubor vymazat do produkce (není na nic napojen)

import Route from "./route";
import { validateObject } from "../middleware";
import { ExampleCalcRequestDto } from "../models";
import { exampleController } from "../controllers";
import path from "path";

export class ExampleRoute extends Route {
  setPrefix() {
    return "";
  }

  protected initializeRoutes(): void {
    // Routa, která vrací css
    this.cssRouter.get("/resources/css", (req, res) => {
      res.sendFile(path.resolve(__dirname + '/../output.css'));
    });

    // Routa, která vrací application/html
    this.viewRouter.get("/viewTest", (req, res) => {
      res.render("example/index");
    });

    this.viewRouter.get("/", (req, res) => {
      res.render("main/index");
    });

    // Routa, která vrací application/json
    this.apiRouter.get("/apiTest", (req, res) => {
      res.json({ message: "testing /app/apiTest" });
    });

    // Zde inicializujeme routu, uděláme základní validaci zaslaných dat a předáme data dále do controlleru
    this.apiRouter.post("/calc", async (req, res) => {
      const data = req.body;
      await validateObject(ExampleCalcRequestDto, data, true, false);
      const responseData = exampleController.calc(data);
      res.json(responseData);
    });
  }
}