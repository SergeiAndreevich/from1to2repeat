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
exports.sessionsService = void 0;
const sessionsRepository_repository_1 = require("../../dataAcsessLayer/repository/sessionsRepository.repository");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
exports.sessionsService = {
    getSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sessionsRepository_repository_1.sessionsRepo.findSessionsByUserId(userId);
        });
    },
    removeOtherSessions(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            if (!payload) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            const result = yield sessionsRepository_repository_1.sessionsRepo.removeOtherSessions(payload);
            return { data: result.data, status: result.status };
        });
    },
    removeThisSession(session, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверяем рефреш-токен
            const payload = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
            if (!payload) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            //свою ли сессию чел завершает?
            const isItYourDevice = yield sessionsRepository_repository_1.sessionsRepo.compareSessions(payload, session);
            if (isItYourDevice === ResultObject_type_1.ResultStatuses.forbidden) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.forbidden };
            }
            if (isItYourDevice === ResultObject_type_1.ResultStatuses.notFound) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            //теперь нужно удалить
            yield sessionsRepository_repository_1.sessionsRepo.removeThisSession(session.deviceId);
            return { data: null, status: ResultObject_type_1.ResultStatuses.success };
        });
    }
};
