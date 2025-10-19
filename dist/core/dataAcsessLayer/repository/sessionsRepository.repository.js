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
exports.sessionsRepo = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mapSessionsToView_mapper_1 = require("../../mappers/mapSessionsToView.mapper");
const ResultObject_type_1 = require("../../types/ResultObject.type");
exports.sessionsRepo = {
    findSessionsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessions = yield mongoDB_db_1.authCollection.find({ userId: userId, revoked: false }).toArray();
            return sessions.map(session => (0, mapSessionsToView_mapper_1.mapSessionToView)(session));
        });
    },
    removeOtherSessions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, deviceId } = payload;
            yield mongoDB_db_1.authCollection.updateMany({ userId: userId, deviceId: { $ne: deviceId }, revoked: false }, { $set: { revoked: true } });
            return { data: null, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    compareSessions(payload, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionFromRT = yield mongoDB_db_1.authCollection.findOne({ deviceId: payload.deviceId, revoked: false });
            if (!sessionFromRT) {
                return ResultObject_type_1.ResultStatuses.notFound;
            }
            if (sessionFromRT.userId !== session.userId) {
                return ResultObject_type_1.ResultStatuses.forbidden;
            }
            return ResultObject_type_1.ResultStatuses.success;
        });
    },
    removeThisSession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.authCollection.updateOne({ deviceId: deviceId }, { $set: { revoked: true } });
            return;
        });
    }
};
