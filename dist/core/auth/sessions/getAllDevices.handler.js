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
exports.getAllDevicesHandler = getAllDevicesHandler;
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
const sessionsRepository_repository_1 = require("../../dataAcsessLayer/repository/sessionsRepository.repository");
function getAllDevicesHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //условие гуарда здесь валидный рефреш токен. И только!
        console.log("----------------Getting all devices");
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        console.log('IN DEVICES GET --- DECODED REFRESH TOKEN', decodedRefresh);
        const sessions = yield sessionsRepository_repository_1.sessionsRepo.findSessionsByUserId(decodedRefresh.userId);
        if (sessions.length < 1) {
            console.log('there is on one session in GET./devices');
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        //а вдруг он только зашел и хочет посмотреть, есть ли там что. Ну как минимум одно ведь должно же быть активно
        console.log('SESSIONS IN GET./devices', sessions);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(sessions);
    });
}
