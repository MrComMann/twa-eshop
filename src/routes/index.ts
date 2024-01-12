import Route from "./route";
import path from "path";
import jwt from "jsonwebtoken";
import PrismaClient from '@prisma/client'
import cookieParser from 'cookie-parser';
require('dotenv').config

const prisma = new PrismaClient.PrismaClient()

export class MainRoute extends Route {
    setPrefix(): string {
        return "";
    }

    protected initializeRoutes(): void {
        // css
        this.cssRouter.get("/resources/css", (req, res) => {
            console.log('200 /resources/css')
            res.sendFile(path.resolve(__dirname + '/../output.css'));
        });
        this.cssRouter.get("/resources/maincss", (req, res) => {
            console.log('200 /resources/maincss')
            res.sendFile(path.resolve(__dirname + '/../main.css'));
        });

        this.imageRouter.get("/images/main", (req, res) => {
            const imagePath = path.join(__dirname, '../public/main-background.png');
            console.log('200 /images/main')
            res.sendFile(imagePath);
        })

        this.apiRouter.get("/api/products", async (req, res) => {
            try {
                const products = await prisma.sP_products.findMany({
                    where: {
                        flag: true
                    }
                });

                let data = []
                products.forEach(obj => {
                    data.push({ name: obj['name'], description: obj['description'], price: obj['price'], photo: obj['photo'] })
                });
                res.send(data);
            } catch (e) {
                console.error(e);
                res.status(500).send('An error occurred');
            } finally {
                await prisma.$disconnect()
            }

            console.log('200 /api/products')
        })

        this.viewRouter.get("/", (req, res) => {
            console.log('200 /')
            res.render("main/index");
        });

        this.viewRouter.get("/administration/login", (req, res) => {
            console.log('200 /administration/login')
            res.render("login/index");
        })

        this.adminRouter.get("/administration", (req, res) => {
            console.log('200 /administration')
            res.setHeader("Content-type", "text/html");
            res.render("admin/index");
        })

        this.adminRouter.get("/administration/logout", cookieParser(), (req, res) => {
            res.clearCookie('token');
            res.end()
        })

        this.apiRouter.post("/auth/login", (req, res) => {
            async function main() {
                console.log('Trying to log in...')
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

                            console.log('Success!')
                            res.status(200)
                            res.send(JSON.stringify("Successfully logged in."))
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
