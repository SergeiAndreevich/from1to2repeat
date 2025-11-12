"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_PASSWORD = exports.ADMIN_USERNAME = void 0;
exports.basicGuard = basicGuard;
const httpStatuses_type_1 = require("../types/httpStatuses.type");
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
//Дополнительно себе в тетрадь напиши
async function basicGuard(req, res, next) {
    //вытаскиваем из хедерс авторизацию
    const auth = req.headers.authorization;
    //если там пусто, то выкидываем ошибку авторизации
    if (auth === undefined || auth === '') {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    // тк мы работаем с Base64, то выглядит это как Base login:password, следовательно, сплитим
    const [base, token] = auth.split(' ');
    //есди первое слово не Base, то снова ошибка
    if (base !== 'Basic') {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    //логика такова, что нам приходит зашифрованный логин и пароль. Мы их просто раскодируем в ютф-8
    const data = Buffer.from(token, 'base64').toString('utf-8');
    //теперь нужно разделить их на логин и пароль
    const [login, password] = data.split(':');
    // теперь сравнивание логин (тот, что пришел, с тем, что у нас). Аналогично поступаем с паролем
    if (login !== exports.ADMIN_USERNAME || password !== exports.ADMIN_PASSWORD) {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    next();
}
