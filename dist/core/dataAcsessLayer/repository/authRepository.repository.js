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
exports.authRepo = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
exports.authRepo = {
    // async addRefreshToken(data: TypeAccessDataModel){
    //     await authCollection.insertOne(data)
    //     return
    // },
    addSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.authCollection.insertOne(data);
            console.log('CREATED SESSION IN LOGIN', data);
            return;
        });
    },
    updateSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.authCollection.updateOne({ userId: session.userId }, {
                $set: {
                    deviceId: session.deviceId,
                    lastActivity: session.lastActivity,
                    expiresAt: session.expiresAt
                }
            });
            return;
        });
    },
    updateTokens(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            //1️⃣ ищем и проверяем на актуальность введенный рефреш-токен
            const oldSession = yield mongoDB_db_1.authCollection.findOne({ deviceId: payload.deviceId });
            if (!oldSession) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            // 2️⃣ если токен уже отозван — сразу 401
            if (oldSession.revoked) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            // 3️⃣ проверяем, не истёк ли токен (сравниваем корректно)
            const now = new Date();
            if (oldSession.expiresAt.getTime() < now.getTime()) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            // oldRefreshToken.expiresAt — дата в формате Date, хранящаяся в БД, в милисекундах;
            // refreshToken.expiresAt — число в секундах UNIX, пришедшее из JWT.
            // 4️⃣ протухаем старый рефреш-токен
            yield mongoDB_db_1.authCollection.updateOne({ deviceId: payload.deviceId }, { $set: { revoked: true } });
            //создаем новую пару аксес-рефреш
            const newAccessToken = jwt_helper_1.jwtHelper.generateAccessToken(oldSession.userId);
            const newRefreshToken = jwt_helper_1.jwtHelper.generateRefreshToken(oldSession.userId);
            //сохраняем в БД
            const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(newRefreshToken.refreshToken);
            const update = {
                userId: oldSession.userId,
                deviceId: newRefreshToken.deviceId,
                ip: oldSession.ip,
                deviceName: oldSession.deviceName,
                expiresAt: new Date(decodedRefresh.exp * 1000),
                lastActivity: new Date(decodedRefresh.iat * 1000),
                revoked: false
            };
            yield exports.authRepo.addSession(update);
            return { data: { accessToken: newAccessToken, refreshToken: newRefreshToken.deviceId }, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    removeRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            //ищем и проверяем на актуальность введенный рефреш-токен
            const oldSession = yield mongoDB_db_1.authCollection.findOne({ deviceId: token.jti });
            if (!oldSession) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            // 🔥 если токен уже отозван
            if (oldSession.revoked) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            if (oldSession.expiresAt.getTime() < new Date().getTime()) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            //протухаем старый рефреш-токен
            yield mongoDB_db_1.authCollection.updateOne({ deviceId: token.jti }, { $set: {
                    revoked: true
                } });
            return { data: null, status: ResultObject_type_1.ResultStatuses.success };
        });
    }
};
