"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = require("./core/path");
const authRouter_router_1 = require("./routers/authRouter.router");
const blogsRouter_router_1 = require("./routers/blogsRouter.router");
const postsRouter_router_1 = require("./routers/postsRouter.router");
const testingRouter_router_1 = require("./routers/testingRouter.router");
const usersRouter_router_1 = require("./routers/usersRouter.router");
const commentsRouter_router_1 = require("./routers/commentsRouter.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const securityDevices_router_1 = require("./routers/securityDevices.router");
const setupApp = (app) => {
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json());
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).send(`Go to ${path_1.PATH.docs}`);
    }));
    // app.use((req, res, next) => {
    //     console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    //     console.log('Cookies:', req.cookies);
    //     console.log('Headers:', req.headers);
    //     next();
    // });
    app.use(path_1.PATH.auth, authRouter_router_1.authRouter);
    app.use(path_1.PATH.blogs, blogsRouter_router_1.blogsRouter);
    app.use(path_1.PATH.posts, postsRouter_router_1.postsRouter);
    app.use(path_1.PATH.testing, testingRouter_router_1.testingRouter);
    app.use(path_1.PATH.users, usersRouter_router_1.usersRouter);
    app.use(path_1.PATH.comments, commentsRouter_router_1.commentsRouter);
    app.use(path_1.PATH.security, securityDevices_router_1.securityRouter);
    return app;
};
exports.setupApp = setupApp;
