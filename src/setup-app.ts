import express, {Express, Request, Response} from "express";
import {PATH} from "./core/path";
import {authRouter} from "./routers/authRouter.router";
import {blogsRouter} from "./routers/blogsRouter.router";
import {postsRouter} from "./routers/postsRouter.router";
import {testingRouter} from "./routers/testingRouter.router";
import {usersRouter} from "./routers/usersRouter.router";
import {commentsRouter} from "./routers/commentsRouter.router";

export const setupApp =(app: Express)=>{
    app.use(express.json());
    app.get('/', async (req: Request ,res: Response)=>{
        res.status(200).send(`Go to ${PATH.docs}`)
    });
    app.use(PATH.auth, authRouter);
    app.use(PATH.blogs,blogsRouter);
    app.use(PATH.posts, postsRouter);
    app.use(PATH.testing, testingRouter);
    app.use(PATH.users, usersRouter);
    app.use(PATH.comments, commentsRouter);

    return app
}