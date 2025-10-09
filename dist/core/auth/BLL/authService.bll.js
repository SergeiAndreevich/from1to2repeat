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
    checkUserInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
            const { loginOrEmail, password } = info;
            const doesUserExist = yield queryRepo_repository_1.queryRepo.findUserByAuthOrFail(loginOrEmail, password);
            //console.log("DEBUG doesUserExist:", doesUserExist);
            //если не удалась аутентификация, то прерываем процесс авторизации
            if (doesUserExist.status !== ResultObject_type_1.ResultStatuses.success) {
                return {
                    data: null,
                    status: doesUserExist.status
                };
            }
            // создаем пару AccessToken и RefreshToken
            const userId = doesUserExist.data.id;
            const accessToken = jwt_helper_1.jwtHelper.generateAccessToken(userId);
            const { refreshToken, jti } = jwt_helper_1.jwtHelper.generateRefreshToken(userId);
            //console.log("DEBUG accessToken:", accessToken);
            //console.log("DEBUG refreshToken:", refreshToken);
            //сохраняем в БД
            const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            //console.log("DEBUG decodedRefresh:", decodedRefresh);
            // if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
            //     res.sendStatus(httpStatus.Unauthorized);
            //     return
            // }
            const tokenToDb = {
                jti,
                userId,
                expiresAt: new Date(decodedRefresh.exp * 1000),
                revoked: false
            };
            yield authRepository_repository_1.authRepo.addRefreshToken(tokenToDb);
            return {
                data: { accessToken, refreshToken },
                status: doesUserExist.status
            };
        });
    },
    updateRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //раскукоживаем рефреш-токен и получаем оттуда данные
            const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            if (!decodedRefresh) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized, errorMessage: { field: 'refreshToken', message: 'Refresh token is empty' } };
            }
            //идем в БД и проверяем, актуальный ли у нас рефреш-токен
            //изменяем в БД данные по старому рефреш-токену
            //создаем новую пару аксес-рефреш токенов
            //выдаем их как результат
            //а уже в хендлере аксес-токен отдаем в боди, а в куки зашиваем новый рефреш
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
