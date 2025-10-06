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
    addRefreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.authCollection.insertOne(data);
            return;
        });
    },
    updateTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //ищем и проверяем на актуальность введенный рефреш-токен
            const oldRefreshToken = yield mongoDB_db_1.authCollection.findOne({ jti: refreshToken.jti });
            if (!oldRefreshToken) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            if (oldRefreshToken.expiresAt < refreshToken.expiresAt) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            //протухаем старый рефреш-токен
            yield mongoDB_db_1.authCollection.updateOne({ jti: refreshToken.jti }, { $set: {
                    revoked: true
                } });
            //создаем новую пару аксес-рефреш
            const newAccessToken = yield jwt_helper_1.jwtHelper.generateAccessToken(oldRefreshToken.userId);
            const newRefreshToken = yield jwt_helper_1.jwtHelper.generateRefreshToken(oldRefreshToken.userId);
            //сохраняем в БД
            const decodedRefresh = yield jwt_helper_1.jwtHelper.verifyRefreshToken(newRefreshToken.refreshToken);
            const tokenToDb = {
                jti: newRefreshToken.jti,
                userId: oldRefreshToken.userId,
                expiresAt: new Date(decodedRefresh.exp * 1000),
                revoked: false
            };
            yield exports.authRepo.addRefreshToken(tokenToDb);
            return { data: { accessToken: newAccessToken, refreshToken: newRefreshToken.refreshToken }, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    removeRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            //ищем и проверяем на актуальность введенный рефреш-токен
            const oldRefreshToken = yield mongoDB_db_1.authCollection.findOne({ jti: token.jti });
            if (!oldRefreshToken) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            if (oldRefreshToken.expiresAt < token.expiresAt) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            //протухаем старый рефреш-токен
            yield mongoDB_db_1.authCollection.updateOne({ jti: token.jti }, { $set: {
                    revoked: true
                } });
            return { data: null, status: ResultObject_type_1.ResultStatuses.success };
        });
    }
};
