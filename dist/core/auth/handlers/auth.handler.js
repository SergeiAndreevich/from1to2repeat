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
exports.authHandler = authHandler;
const authService_bll_1 = require("../BLL/authService.bll");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
function authHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const ip = req.ip;
        if (!ip) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Forbidden);
            return;
        }
        const deviceName = req.headers['user-agent'] || 'Unknown device';
        //проверяем, есть ли такой юзер. Если есть и все данные сходятся - выдаем токены
        const result = yield authService_bll_1.authService.checkUserInfo(req.body, { ip, deviceName });
        switch (result.status) {
            case ResultObject_type_1.ResultStatuses.notFound:
                res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
                break;
            case ResultObject_type_1.ResultStatuses.unauthorized:
                res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
                break;
            case ResultObject_type_1.ResultStatuses.success:
                res.cookie("refreshToken", result.data.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 20 * 1000 // 20 secund в ms
                });
                res.status(httpStatuses_type_1.httpStatus.Ok).send({ accessToken: result.data.accessToken });
                console.log("При логинизации создался SET-COOKIE:", res.getHeaders()['set-cookie']);
                break;
            default:
                res.sendStatus(httpStatuses_type_1.httpStatus.InternalServerError);
                break;
        }
    });
}
//400 - ошибка валидации
//401 - неправильные данные для входа (не совпало с БД)
//429 - больше 5 попыток авторизации за 10 секунд с одного ip-адреса
