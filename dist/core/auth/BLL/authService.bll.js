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
exports.authService = void 0;
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
const authRepository_repository_1 = require("../../dataAcsessLayer/repository/authRepository.repository");
exports.authService = {
    checkUserInfo(info, dataToDb) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
            const { loginOrEmail, password } = info;
            const user = yield queryRepo_repository_1.queryRepo.findUserByAuthOrFail(loginOrEmail, password);
            //если не удалась аутентификация, то прерываем процесс авторизации
            if (user.status !== ResultObject_type_1.ResultStatuses.success) {
                return {
                    data: null,
                    status: user.status
                };
            }
            // создаем пару AccessToken и RefreshToken
            const userId = user.data.id; //userID это MomgoID, которое присвоилось юзеру при регистрации
            const accessToken = jwt_helper_1.jwtHelper.generateAccessToken(userId);
            const { refreshToken, deviceId } = jwt_helper_1.jwtHelper.generateRefreshToken(userId);
            //раскукоживаем payload (в payload сидит userId, jti, iat, exp = iat + expiresIn)
            const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            if (!decodedRefresh) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.error };
            }
            //создаем экземпляр сессии
            const session = {
                userId: userId,
                deviceId: deviceId,
                ip: dataToDb.ip,
                deviceName: dataToDb.deviceName,
                lastActivity: new Date(decodedRefresh.iat * 1000),
                expiresAt: new Date(decodedRefresh.exp * 1000),
                revoked: false
            };
            //сохраняем в БД
            yield authRepository_repository_1.authRepo.addSession(session);
            return {
                data: { accessToken, refreshToken },
                status: user.status
            };
        });
    },
    updateRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //раскукоживаем рефреш-токен и получаем оттуда данные
            const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            if (!decodedRefresh) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            const result = yield authRepository_repository_1.authRepo.updateTokens(decodedRefresh);
            return { data: result.data, status: result.status, errorMessage: result.errorMessage };
        });
    },
    removeRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            if (!decodedRefresh) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized, errorMessage: { field: 'refreshToken', message: 'Refresh token is empty' } };
            }
            const result = yield authRepository_repository_1.authRepo.removeRefreshToken(decodedRefresh);
            return { data: result.data, status: result.status };
        });
    }
};
