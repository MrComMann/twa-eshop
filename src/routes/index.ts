import Route from "./route";
import path from "path";
import jwt from "jsonwebtoken";
import PrismaClient from '@prisma/client'
import cookieParser from 'cookie-parser';
import { adminService, orderService } from "../services";
require('dotenv').config

const prisma = new PrismaClient.PrismaClient()

export class MainRoute extends Route {
    setPrefix(): string {
        return "";
    }

    protected initializeRoutes(): void {
        // css
        this.cssRouter.get("/resources/css", (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            const filePath = path.join(__dirname, '../../public/output.css')
            res.sendFile(filePath)
            console.log(filePath)
        });
        this.cssRouter.get("/resources/maincss", (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            const filePath = path.join(__dirname, '../../public/main.css')
            res.sendFile(filePath);
        });

        this.imageRouter.get("/images/main", (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            const imagePath = path.join(__dirname, '../../public/main-background.png');
            res.sendFile(imagePath);
        })

        this.apiRouter.post("/order", async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)

            const { name, email, address, value, product } = req.body
            console.log(product)
            const newOrder = await orderService.create(name, email, address, parseInt(product), parseInt(value))
            console.log(name, email, address, value, product)
            if (newOrder.length > 0) {
                res.send(JSON.stringify('Success!'));
            }
            else {
                res.send(JSON.stringify('Wrong product.'));
            }
        })

        this.viewRouter.get("/buy/:product", async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            try {
                const id = parseInt(req.params.product)
                const product = await prisma.sP_products.findUnique({
                    where: { flag: true, id: id }
                });

                res.render("order/index", { product_id: id, name: product['name'], description: product['description'], price: product['price'], photo: product['photo'].toString('base64') });
            } catch (e) {
                console.error(e);
                res.status(500).send('An error occurred');
            } finally {
                await prisma.$disconnect()
            }
        });

        this.apiRouter.get("/api/products", async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            try {
                const products = await prisma.sP_products.findMany({
                    where: { flag: true }
                });

                let data = []
                products.forEach(obj => {
                    data.push({ name: obj['name'], description: obj['description'], price: obj['price'], photo: obj['photo'].toString('base64') })
                });
                res.send(data);
            } catch (e) {
                console.error(e);
                res.status(500).send('An error occurred');
            } finally {
                await prisma.$disconnect()
            }
        })

        this.viewRouter.get("/", async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            try {
                const products = await prisma.sP_products.findMany({
                    where: { flag: true }
                });

                let data = []
                products.forEach(obj => {
                    data.push(obj['id'])
                });
                res.render("main/index", { first: data[0], second: data[1], third: data[2] });
            } finally {
                await prisma.$disconnect()
            }

        });

        this.viewRouter.get("/administration", (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.render("login/index");
        })

        this.adminRouter.get("/administration/home", cookieParser(), (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.setHeader("Content-type", "text/html");
            res.render("admin/index");
        })

        this.adminRouter.post("/administration/showorders", cookieParser(), async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.setHeader("Content-type", "application/json");
            try {
                const orders = await prisma.sP_orders.findMany();
                res.send(JSON.stringify(orders))
            } finally {
                await prisma.$disconnect()
            }
        })
        this.adminRouter.post("/administration/showproducts", cookieParser(), async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.setHeader("Content-type", "application/json");
            try {
                const products = await prisma.sP_products.findMany();
                res.send(JSON.stringify(products))
            } finally {
                await prisma.$disconnect()
            }
        })

        this.adminRouter.post("/administration/editflags", cookieParser(), async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.setHeader("Content-type", "application/json");
            const { flag1, flag2, flag3 } = req.body
            try {
                await prisma.sP_products.updateMany({
                    data: {
                        flag: false
                    }
                });
                await prisma.sP_products.update({
                    where: { id: flag1 }, data: { flag: true }
                });
                await prisma.sP_products.update({
                    where: { id: flag2 }, data: { flag: true }
                });
                await prisma.sP_products.update({
                    where: { id: flag3 }, data: { flag: true }
                });
                res.send(JSON.stringify("Updated"))
            } finally {
                await prisma.$disconnect()
            }
        })

        this.adminRouter.post("/administration/logout", cookieParser(), (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.clearCookie('token');
            res.end()
        })

        this.adminRouter.post("/administration/deleteproduct", cookieParser(), async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.setHeader("Content-type", "application/json");
            const { id } = req.body
            try {
                await prisma.sP_products.delete({
                    where: {
                        id: id
                    }
                });
                res.send(JSON.stringify('Product deleted.'))
            } finally {
                await prisma.$disconnect()
            }
        })

        this.adminRouter.post("/administration/adduser", cookieParser(), async (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
            res.setHeader("Content-type", "application/json");
            const { username } = req.body
            const pass = await adminService.addUser(username)
            if (pass !== "") {
                res.status(200)
                console.log(pass)
                res.send(JSON.stringify({ message: "User successfully created.", pass: pass }))
            } else {
                res.status(401)
                res.send(JSON.stringify({ message: "Something went wrong." }))
            }
        })

        this.apiRouter.post("/auth/login", (req, res) => {
            const statMes = res.statusMessage ?? "OK";
            console.log(res.statusCode + " " + req.path + " " + statMes)
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

const routes: Route[] = [new MainRoute()];

export default Route;
export { routes };
