"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGuard = tokenGuard;
const httpStatuses_type_1 = require("../types/httpStatuses.type");
const jwt_helper_1 = require("../helpers/jwt.helper");
async function tokenGuard(req, res, next) {
    //проверяем, пришел ли токен
    const userAuth = req.headers.authorization;
    if (!userAuth) {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    //если пришло что-то в headers, надо это оттуда достать
    const [authType, token] = userAuth.split(' ');
    //проверяем, какая это авторизация. Нам нужна именно bearer, другая идет лесом
    //если не токен-авторизация, то не выдадим доступ
    if (authType !== 'Bearer') {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    //если не извлекся токен
    if (!token) {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    // const payload =  await jwtHelper.verifyToken(token);
    // if(!payload) {
    //     res.sendStatus(httpStatus.Unauthorized);
    //     return
    // }
    // //ниже не знаю насколько корректно написал, но вроде вроде
    // const id = payload as JwtPayload;
    // //console.log('userId in authGuard middleware', payload, id,role);
    // req.userId = id.toString();
    // next()
    const payload = await jwt_helper_1.jwtHelper.verifyToken(token);
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    req.userId = payload.userId;
    next();
}
