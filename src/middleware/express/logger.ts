import express from "express";


const logger = (req: express.Request, _res: express.Response, next: express.NextFunction) => {

    console.log(`${req.method} ${req.path}`);

    next();

};


export default logger;