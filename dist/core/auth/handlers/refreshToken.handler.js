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
exports.refreshHandler = refreshHandler;
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const authService_bll_1 = require("../BLL/authService.bll");
const ResultObject_type_1 = require("../../types/ResultObject.type");
function refreshHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log('______START REFRESH_TOKEN HANDLER______')
        //проверяем,пришел ли в куки рефреш-токен
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        // ВАЖНО: Сначала проверяем валидность токена
        //ищем, обновляем пару
        const result = yield authService_bll_1.authService.updateRefreshToken(refreshToken);
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        //отправляем пользователю
        res.cookie("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: true,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 20 * 1000 // 20 secund в ms
        });
        res.status(httpStatuses_type_1.httpStatus.Ok).send({ accessToken: result.data.accessToken });
    });
}
//идем в БД и проверяем, актуальный ли у нас рефреш-токен
//изменяем в БД данные по старому рефреш-токену
//создаем новую пару аксес-рефреш токенов
//выдаем их как результат
//а уже в хендлере аксес-токен отдаем в боди, а в куки зашиваем новый рефреш
