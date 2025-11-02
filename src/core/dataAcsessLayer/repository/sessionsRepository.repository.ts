import {authCollection} from "../../db/mongoDB.db";
import {mapSessionToView} from "../../mappers/mapSessionsToView.mapper";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {httpStatus} from "../../types/httpStatuses.type";
import {TypeSessionModel, TypeSessionToViewModel} from "../../auth/auth.types";
import {JwtPayload} from "jsonwebtoken";

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

export class SessionsRepo{
    async findSessionsByUserId(userId:string) {
        const sessions = await authCollection.find({userId: userId, revoked:false}).toArray();
        return sessions.map(session => mapSessionToView(session));
    }
    async removeOtherSessions(payload: JwtPayload):Promise<IResult<string | null>>{
        const {userId,  deviceId} = payload;
        await authCollection.updateMany(
            {userId:userId, deviceId: {$ne: deviceId}, revoked:false},
            {$set: {revoked:true}},
        );
        return {data:null, status:ResultStatuses.success}
    }
    async compareSessions(payload:JwtPayload, session: TypeSessionToViewModel&{userId:string}) {
        const sessionFromRT = await authCollection.findOne<TypeSessionModel>({deviceId: payload.deviceId, revoked:false});
        if(!sessionFromRT) {
            return ResultStatuses.notFound
        }
        if(sessionFromRT.userId !== session.userId) {
            return ResultStatuses.forbidden
        }
        return ResultStatuses.success
    }
    async removeThisSession(deviceId:string):Promise<void> {
        await authCollection.updateOne(
            {deviceId: deviceId},
            {$set: {revoked:true}},
        );
        return
    }
}

export const sessionsRepo = new SessionsRepo()
