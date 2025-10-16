import {authCollection} from "../../db/mongoDB.db";
import {JwtPayload} from "jsonwebtoken";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {TypeSessionModel, TypeSessionUpdateModel} from "../../auth/auth.types";

export type TypeAccessDataModel = {
    jti: string;
    userId: string;
    expiresAt: Date;
    revoked: boolean;
}

export const authRepo = {
    // async addRefreshToken(data: TypeAccessDataModel){
    //     await authCollection.insertOne(data)
    //     return
    // },
    async addSession(data: TypeSessionModel){
        await authCollection.insertOne(data);
        console.log('CREATED SESSION IN LOGIN',  data);
        return
    },
    async updateSession(session: TypeSessionUpdateModel){
        await authCollection.updateOne({userId: session.userId}, {
            $set: {
                deviceId: session.deviceId,
                lastActivity: session.lastActivity,
                expiresAt: session.expiresAt
            }
        })
        return
    },
    async updateTokens(payload: JwtPayload):Promise<IResult<null | {accessToken: string, refreshToken: string}>>{
        //1️⃣ ищем и проверяем на актуальность введенный рефреш-токен
        const oldSession = await authCollection.findOne({deviceId: payload.deviceId});
        if(!oldSession) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        // 2️⃣ если токен уже отозван — сразу 401
        if (oldSession.revoked) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        // 3️⃣ проверяем, не истёк ли токен (сравниваем корректно)
        const now = new Date();
        if (oldSession.expiresAt.getTime() < now.getTime()) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        // oldRefreshToken.expiresAt — дата в формате Date, хранящаяся в БД, в милисекундах;
        // refreshToken.expiresAt — число в секундах UNIX, пришедшее из JWT.

        // 4️⃣ протухаем старый рефреш-токен
        await authCollection.updateOne(
            {deviceId: payload.deviceId},
            {$set: { revoked: true}}
        );
        //создаем новую пару аксес-рефреш
        const newAccessToken = jwtHelper.generateAccessToken(oldSession.userId);
        const newRefreshToken = jwtHelper.generateRefreshToken(oldSession.userId);

        //сохраняем в БД
        const decodedRefresh =  jwtHelper.verifyRefreshToken(newRefreshToken.refreshToken);
        const update:TypeSessionModel = {
            userId: oldSession.userId,
            deviceId: newRefreshToken.deviceId,
            ip: oldSession.ip,
            deviceName: oldSession.deviceName,
            expiresAt: new Date(decodedRefresh!.exp!* 1000),
            lastActivity: new Date(decodedRefresh!.iat!* 1000),
            revoked: false
        }
        await authRepo.addSession(update);
        return  {data: {accessToken: newAccessToken, refreshToken: newRefreshToken.deviceId}, status: ResultStatuses.success}
    },
    async removeRefreshToken(token: JwtPayload):Promise<IResult<null>>{
        //ищем и проверяем на актуальность введенный рефреш-токен
        const oldSession = await authCollection.findOne({deviceId: token.jti});
        if(!oldSession) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        // 🔥 если токен уже отозван
        if (oldSession.revoked) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        if(oldSession!.expiresAt.getTime() < new Date().getTime()) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        //протухаем старый рефреш-токен
        await authCollection.updateOne({deviceId: token.jti},{$set: {
                revoked: true
        }});
        return {data: null, status: ResultStatuses.success}
    }
}