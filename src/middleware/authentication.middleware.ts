import jwt from 'jsonwebtoken'
require('dotenv').config

export function authenticationMiddleware(req, res, next) {
    const token = req.headers.authorization as unknown as string
    jwt.verify(token, process.env.SECRET, (error, data: any) => {
        if (error) {
            res.status(400)
            res.send()
        }
        req.data = data
    })
    next()
};