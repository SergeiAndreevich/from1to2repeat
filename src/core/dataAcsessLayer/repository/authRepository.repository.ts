import {authCollection, usersCollection} from "../../db/mongoDB.db";
import {JwtPayload} from "jsonwebtoken";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {TypeSessionModel, TypeSessionUpdateModel} from "../../auth/auth.types";
import {injectable} from "inversify";

export type TypeAccessDataModel = {
    jti: string;
    userId: string;
    expiresAt: Date;
    revoked: boolean;
}

// export const authRepo = {
//     // async addRefreshToken(data: TypeAccessDataModel){
//     //     await authCollection.insertOne(data)
//     //     return
//     // },
//     async addSession(data: TypeSessionModel){
//         await authCollection.insertOne(data);
//         console.log('CREATED SESSION IN LOGIN',  data);
//         return
//     },
//     async updateSession(session: TypeSessionUpdateModel){
//         await authCollection.updateOne({userId: session.userId}, {
//             $set: {
//                 deviceId: session.deviceId,
//                 lastActivity: session.lastActivity,
//                 expiresAt: session.expiresAt
//             }
//         })
//         return
//     },
//     async updateTokens(payload: JwtPayload):Promise<IResult<null | {accessToken: string, refreshToken: string}>>{
//         //1️⃣ ищем и проверяем на актуальность введенный рефреш-токен
//         const oldSession = await authCollection.findOne({deviceId: payload.deviceId});
//         if(!oldSession) {
//             return {data: null, status: ResultStatuses.unauthorized}
//         }
//         // 2️⃣ если токен уже отозван — сразу 401
//         if (oldSession.revoked) {
//             return { data: null, status: ResultStatuses.unauthorized };
//         }
//         // 3️⃣ проверяем, не истёк ли токен (сравниваем корректно)
//         const now = new Date();
//         if (oldSession.expiresAt.getTime() < now.getTime()) {
//             return { data: null, status: ResultStatuses.unauthorized };
//         }
//         // oldRefreshToken.expiresAt — дата в формате Date, хранящаяся в БД, в милисекундах;
//         // refreshToken.expiresAt — число в секундах UNIX, пришедшее из JWT.
//
//         // 4️⃣ протухаем старый рефреш-токен
//         await authCollection.updateOne(
//             {deviceId: payload.deviceId},
//             {$set: { revoked: true}}
//         );
//         //сейчас немного финт ушами: не записывать новый deviceId, не генерить новый
//         //а сделать новый Рефреш-токен, но со старым jti
//
//
//         //создаем новую пару аксес-рефреш
//         const newAccessToken = jwtHelper.generateAccessToken(oldSession.userId);
//         const newRefreshToken = jwtHelper.updateRefreshToken(
//             oldSession.userId, payload.deviceId);
//
//         //сохраняем в БД
//         const decodedRefresh =  jwtHelper.verifyRefreshToken(newRefreshToken.refreshToken);
//         const update:TypeSessionModel = {
//             userId: oldSession.userId,
//             deviceId: newRefreshToken.deviceId,
//             ip: oldSession.ip,
//             deviceName: oldSession.deviceName,
//             expiresAt: new Date(decodedRefresh!.exp!* 1000),
//             lastActivity: new Date(decodedRefresh!.iat!* 1000),
//             revoked: false
//         }
//         await authRepo.addSession(update);
//         return  {data: {accessToken: newAccessToken, refreshToken: newRefreshToken.refreshToken}, status: ResultStatuses.success}
//     },
//     async removeRefreshToken(token: JwtPayload):Promise<IResult<null>>{
//         //ищем и проверяем на актуальность введенный рефреш-токен
//         const oldSession = await authCollection.findOne({deviceId: token.deviceId});
//         if(!oldSession) {
//             return {data: null, status: ResultStatuses.unauthorized}
//         }
//         // 🔥 если токен уже отозван
//         if (oldSession.revoked) {
//             return { data: null, status: ResultStatuses.unauthorized };
//         }
//         // if(oldSession!.expiresAt.getTime() < new Date().getTime()) {
//         //     return {data: null, status: ResultStatuses.unauthorized}
//         // }
//         //протухаем старый рефреш-токен
//         await authCollection.updateOne({deviceId: token.deviceId},{$set: {
//                 revoked: true
//         }});
//         return {data: null, status: ResultStatuses.success}
//     }
// }

@injectable()
export class AuthRepo {
    async addSession(data: TypeSessionModel){
        await authCollection.insertOne(data);
        console.log('CREATED SESSION IN LOGIN',  data);
        return
    }
    async updateSession(session: TypeSessionUpdateModel){
        await authCollection.updateOne({userId: session.userId}, {
            $set: {
                deviceId: session.deviceId,
                lastActivity: session.lastActivity,
                expiresAt: session.expiresAt
            }
        })
        return
    }
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
        //сейчас немного финт ушами: не записывать новый deviceId, не генерить новый
        //а сделать новый Рефреш-токен, но со старым jti


        //создаем новую пару аксес-рефреш
        const newAccessToken = jwtHelper.generateAccessToken(oldSession.userId);
        const newRefreshToken = jwtHelper.updateRefreshToken(
            oldSession.userId, payload.deviceId);

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
        return  {data: {accessToken: newAccessToken, refreshToken: newRefreshToken.refreshToken}, status: ResultStatuses.success}
    }
    async removeRefreshToken(token: JwtPayload):Promise<IResult<null>>{
        //ищем и проверяем на актуальность введенный рефреш-токен
        const oldSession = await authCollection.findOne({deviceId: token.deviceId});
        if(!oldSession) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        // 🔥 если токен уже отозван
        if (oldSession.revoked) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        // if(oldSession!.expiresAt.getTime() < new Date().getTime()) {
        //     return {data: null, status: ResultStatuses.unauthorized}
        // }
        //протухаем старый рефреш-токен
        await authCollection.updateOne({deviceId: token.deviceId},{$set: {
                revoked: true
            }});
        return {data: null, status: ResultStatuses.success}
    }
    async recoveryPassword(email: string): Promise<IResult<null | string>> {
        let result: IResult;
        //проверяем, есть ли такой email
        const user = usersCollection.findOne({"accountData.email": email});
        if(!user) {
            result = {data: null, status: ResultStatuses.notFound}
            return result
        }

        return
    }
}

export const  authRepo = new AuthRepo();