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
exports.ADMIN_PASSWORD = exports.ADMIN_USERNAME = void 0;
exports.basicGuard = basicGuard;
const httpStatuses_type_1 = require("../types/httpStatuses.type");
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
//Дополнительно себе в тетрадь напиши
function basicGuard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //получаем заголовок и проверяем, basic или нет
        const auth = req.headers.authorization;
        if (!auth) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const [base, token] = auth.split(' ');
        //если первое слово не Base, то снова ошибка
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
    });
}
