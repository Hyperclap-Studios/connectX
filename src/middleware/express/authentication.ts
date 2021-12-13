import express from "express";
import {verify} from "jsonwebtoken";


const authentication = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (process.env.JWT_SECRET) {

        const token = req.headers.authorization?.split(' ')[1];

        if (token) {

            const payload = verify(token, process.env.JWT_SECRET);

            if (payload) {

                res.locals.user = payload;
                next();

            } else {

                res.status(401).json({

                    success: false,
                    error: 'Invalid token'

                });

            }

        }

    }

};


export default authentication;