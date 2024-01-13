import PrismaClient from '@prisma/client'

const prisma = new PrismaClient.PrismaClient()

class OrderService {

    async create(name: string, email: string, address: string, product: number, value: number) {
        let result = ""

        const productExists = await prisma.sP_products.findUnique({
            where: { id: product },
        });
        if (productExists) {
            await prisma.sP_orders.create({
                data: {
                    product: productExists.id,
                    value: value,
                    email: email,
                    name: name,
                    address: address
                },
            });
            result = "success"
        }
        return result;
    }

    show() {

    }

}

export const orderService = new OrderService();
