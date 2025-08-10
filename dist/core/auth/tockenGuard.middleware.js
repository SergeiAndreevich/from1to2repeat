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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGuard = tokenGuard;
const httpStatuses_type_1 = require("../types/httpStatuses.type");
const jwt_helper_1 = require("../helpers/jwt.helper");
function tokenGuard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const payload = yield jwt_helper_1.jwtHelper.verifyToken(token);
        if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        req.userId = payload.userId;
        next();
    });
}
