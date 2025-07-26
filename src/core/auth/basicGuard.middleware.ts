import {Request, Response, NextFunction} from 'express';
import {httpStatus} from "../types/httpStatuses.type";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

//Дополнительно себе в тетрадь напиши

export async function basicGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
    //получаем заголовок и проверяем, basic или нет
    const auth = req.headers.authorization;
    if (!auth) {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    const [base, token] = auth.split(' ');
    //если первое слово не Base, то снова ошибка
    if(base !== 'Basic'){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }

    //логика такова, что нам приходит зашифрованный логин и пароль. Мы их просто раскодируем в ютф-8
    const data = Buffer.from(token, 'base64').toString('utf-8');
    //теперь нужно разделить их на логин и пароль
    const [login, password] = data.split(':');
    // теперь сравнивание логин (тот, что пришел, с тем, что у нас). Аналогично поступаем с паролем
    if(login !== ADMIN_USERNAME || password !== ADMIN_PASSWORD){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    next()


}