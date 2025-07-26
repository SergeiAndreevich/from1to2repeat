import {NextFunction, Request, Response} from "express";
import {httpStatus} from "../types/httpStatuses.type";
import {jwtHelper} from "../helpers/jwt.helper";
import {JwtPayload} from "jsonwebtoken";

export async function tokenGuard(req: Request, res: Response, next: NextFunction){
    //проверяем, пришел ли токен
    const userAuth = req.headers.authorization;
    if(!userAuth) {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }

    //если пришло что-то в headers, надо это оттуда достать
    const [authType, token] = userAuth.split(' ');
    //проверяем, какая это авторизация. Нам нужна именно bearer, другая идет лесом
    //если не токен-авторизация, то не выдадим доступ
    if(authType !== 'Bearer') {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    //если не извлекся токен
    if (!token){
        res.sendStatus(httpStatus.Unauthorized)
        return
    }

    const payload =  await jwtHelper.verifyToken(token);
    if(!payload) {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    const id = payload as JwtPayload;
    //console.log('userId in authGuard middleware', payload, id,role);
    req.userId = id.toString();
    next()
}

// Расширяем интерфейс Request, чтобы добавить свойство user
declare global {
    namespace Express {
        interface Request {
            userId?:  string // Знак вопроса делает свойство необязательным
        }
    }
}