import express, {Express, Request, Response} from "express";
import {PATH} from "./core/path";
import {authRouter} from "./routers/authRouter.router";
import {blogsRouter} from "./routers/blogsRouter.router";
import {postsRouter} from "./routers/postsRouter.router";
import {testingRouter} from "./routers/testingRouter.router";
import {usersRouter} from "./routers/usersRouter.router";
import {commentsRouter} from "./routers/commentsRouter.router";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routers/securityDevices.router";

export const setupApp =(app: Express)=>{
    app.use(cookieParser());
    app.use(express.json());
    app.get('/', async (req: Request ,res: Response)=>{
        res.status(200).send(`Go to ${PATH.docs}`)
    });
    // app.use((req, res, next) => {
    //     console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    //     console.log('Cookies:', req.cookies);
    //     console.log('Headers:', req.headers);
    //     next();
    // });
    app.use(PATH.auth, authRouter);
    app.use(PATH.blogs,blogsRouter);
    app.use(PATH.posts, postsRouter);
    app.use(PATH.testing, testingRouter);
    app.use(PATH.users, usersRouter);
    app.use(PATH.comments, commentsRouter);
    app.use(PATH.security,securityRouter);

    return app
}