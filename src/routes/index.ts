import Route from "./route";
import { authenticationMiddleware } from "../middleware";
import path from "path";
import jwt from "jsonwebtoken";
import PrismaClient from '@prisma/client'
require('dotenv').config

const prisma = new PrismaClient.PrismaClient()

export class MainRoute extends Route {
    setPrefix(): string {
        return "";
    }

    protected initializeRoutes(): void {
        // css
        this.cssRouter.get("/resources/css", (req, res) => {
            res.sendFile(path.resolve(__dirname + '/../output.css'));
        });

        this.viewRouter.get("/", (req, res) => {
            res.render("layout/index");
        });

        this.adminRouter.get("/administration", (req, res) => {
            res.render("admin/index");
        })

        this.viewRouter.get("/administration/login", (req, res) => {
            res.render("login/index");
        })

        this.adminRouter.post("/administration/home", (req, res) => {
            res.render("admin/index");
        })

        this.apiRouter.post("/auth/login", (req, res) => {
            async function main() {
                const userDb = await prisma.sP_users.findMany()
                const { username, password } = req.body
                for (const user of userDb) {
                    if (user.username == username) {
                        if (user.password == password) {
                            const data = {
                                id: user.id,
                                username,
                                iat: Math.floor(Date.now() / 1000),
                                exp: Math.floor(Date.now() / 1000) + 60 * 10
                            }

                            const token = jwt.sign(data, process.env.SECRET)
                            res.cookie("token", token, {
                                httpOnly: true
                            })

                            res.redirect(200, "/administration")
                        }
                        else {
                            res.status(401);
                            res.send(JSON.stringify("Bad password"))
                        }
                    }
                }
                res.status(401)
            }

            main()
                .then(async () => {
                    await prisma.$disconnect()
                })
                .catch(async (e) => {
                    console.error(e)
                    await prisma.$disconnect()
                    process.exit(1)
                })
        });
    }
}
/*
login
add user
create product
delete product
flag product
unflag product
logout
show products
show flagged products
place order
show orders
*/

const routes: Route[] = [new MainRoute()];

export default Route;
export { routes };
