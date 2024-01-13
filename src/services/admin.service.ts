import PrismaClient from '@prisma/client'
import jwt from "jsonwebtoken"
require('dotenv').config
import crypto from 'crypto'

const prisma = new PrismaClient.PrismaClient()

class AdminService {

    async addUser(username: string): Promise<string> {
        let result = "";

        const userExists = await prisma.sP_users.findMany({
            where: { username },
        });

        if (userExists.length === 0) {
            const randomPassword = crypto.randomBytes(12).toString('hex');

            await prisma.sP_users.create({
                data: {
                    username: username,
                    password: randomPassword
                },
            });

            result = randomPassword;
        }

        return result;
    }

}

export const adminService = new AdminService();
