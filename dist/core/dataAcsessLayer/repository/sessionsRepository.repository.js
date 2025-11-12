"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsRepo = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mapSessionsToView_mapper_1 = require("../../mappers/mapSessionsToView.mapper");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const inversify_1 = require("inversify");
// export const sessionsRepo = {
//     async findSessionsByUserId(userId:string) {
//         const sessions = await authCollection.find({userId: userId, revoked:false}).toArray();
//         return sessions.map(session => mapSessionToView(session));
//     },
//     async removeOtherSessions(payload: JwtPayload):Promise<IResult<string | null>>{
//         const {userId,  deviceId} = payload;
//         await authCollection.updateMany(
//             {userId:userId, deviceId: {$ne: deviceId}, revoked:false},
//             {$set: {revoked:true}},
//         );
//         return {data:null, status:ResultStatuses.success}
//     },
//     async compareSessions(payload:JwtPayload, session: TypeSessionToViewModel&{userId:string}) {
//         const sessionFromRT = await authCollection.findOne<TypeSessionModel>({deviceId: payload.deviceId, revoked:false});
//         if(!sessionFromRT) {
//             return ResultStatuses.notFound
//         }
//         if(sessionFromRT.userId !== session.userId) {
//             return ResultStatuses.forbidden
//         }
//         return ResultStatuses.success
//     },
//     async removeThisSession(deviceId:string):Promise<void> {
//         await authCollection.updateOne(
//             {deviceId: deviceId},
//             {$set: {revoked:true}},
//         );
//         return
//     }
// }
let SessionsRepo = class SessionsRepo {
    async findSessionsByUserId(userId) {
        const sessions = await mongoDB_db_1.authCollection.find({ userId: userId, revoked: false }).toArray();
        return sessions.map(session => (0, mapSessionsToView_mapper_1.mapSessionToView)(session));
    }
    async removeOtherSessions(payload) {
        const { userId, deviceId } = payload;
        await mongoDB_db_1.authCollection.updateMany({ userId: userId, deviceId: { $ne: deviceId }, revoked: false }, { $set: { revoked: true } });
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
    async compareSessions(payload, session) {
        const sessionFromRT = await mongoDB_db_1.authCollection.findOne({ deviceId: payload.deviceId, revoked: false });
        if (!sessionFromRT) {
            return ResultObject_type_1.ResultStatuses.notFound;
        }
        if (sessionFromRT.userId !== session.userId) {
            return ResultObject_type_1.ResultStatuses.forbidden;
        }
        return ResultObject_type_1.ResultStatuses.success;
    }
    async removeThisSession(deviceId) {
        await mongoDB_db_1.authCollection.updateOne({ deviceId: deviceId }, { $set: { revoked: true } });
        return;
    }
};
exports.SessionsRepo = SessionsRepo;
exports.SessionsRepo = SessionsRepo = __decorate([
    (0, inversify_1.injectable)()
], SessionsRepo);
