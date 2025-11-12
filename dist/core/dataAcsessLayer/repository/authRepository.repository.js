"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepo = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
const inversify_1 = require("inversify");
const date_fns_1 = require("date-fns");
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
let AuthRepo = class AuthRepo {
    async addSession(data) {
        await mongoDB_db_1.authCollection.insertOne(data);
        console.log('CREATED SESSION IN LOGIN', data);
        return;
    }
    async updateSession(session) {
        await mongoDB_db_1.authCollection.updateOne({ userId: session.userId }, {
            $set: {
                deviceId: session.deviceId,
                lastActivity: session.lastActivity,
                expiresAt: session.expiresAt
            }
        });
        return;
    }
    async updateTokens(payload) {
        //1️⃣ ищем и проверяем на актуальность введенный рефреш-токен
        const oldSession = await mongoDB_db_1.authCollection.findOne({ deviceId: payload.deviceId });
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
        await mongoDB_db_1.authCollection.updateOne({ deviceId: payload.deviceId }, { $set: { revoked: true } });
        //сейчас немного финт ушами: не записывать новый deviceId, не генерить новый
        //а сделать новый Рефреш-токен, но со старым jti
        //создаем новую пару аксес-рефреш
        const newAccessToken = jwt_helper_1.jwtHelper.generateAccessToken(oldSession.userId);
        const newRefreshToken = jwt_helper_1.jwtHelper.updateRefreshToken(oldSession.userId, payload.deviceId);
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
        await this.addSession(update);
        return { data: { accessToken: newAccessToken, refreshToken: newRefreshToken.refreshToken }, status: ResultObject_type_1.ResultStatuses.success };
    }
    async removeRefreshToken(token) {
        //ищем и проверяем на актуальность введенный рефреш-токен
        const oldSession = await mongoDB_db_1.authCollection.findOne({ deviceId: token.deviceId });
        if (!oldSession) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        // 🔥 если токен уже отозван
        if (oldSession.revoked) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        // if(oldSession!.expiresAt.getTime() < new Date().getTime()) {
        //     return {data: null, status: ResultStatuses.unauthorized}
        // }
        //протухаем старый рефреш-токен
        await mongoDB_db_1.authCollection.updateOne({ deviceId: token.deviceId }, { $set: {
                revoked: true
            } });
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
    async recoveryPassword(email, confirmationCode) {
        //проверяем, есть ли такой email
        const user = await mongoDB_db_1.usersCollection.findOne({ "accountData.email": email });
        if (!user) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
        }
        //заготовка данных для вставки
        const newRecovery = {
            confirmationCode: confirmationCode,
            expirationDate: (0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 2,
            }),
            isConfirmed: false
        };
        //обновлем у юзера поля в passwordRecovery
        await mongoDB_db_1.usersCollection.updateOne({ _id: user._id }, { $set: { "passwordRecovery.confirmationCode": newRecovery.confirmationCode,
                "passwordRecovery.expirationDate": newRecovery.expirationDate,
                "passwordRecovery.isConfirmed": newRecovery.isConfirmed
            }
        });
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
    async setNewPassword(code, newPasswordHash) {
        const user = await mongoDB_db_1.usersCollection.findOne({ "passwordRecovery.confirmationCode": code });
        if (!user) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.notFound, errorMessage: { field: 'recoveryCode', message: 'user not found' } };
        }
        if (user.passwordRecovery.expirationDate < new Date()) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized, errorMessage: { field: 'recoveryCode', message: 'code expired' } };
        }
        //проверяем, чтобы не был уже подтвержден
        if (user.passwordRecovery.isConfirmed) {
            //изначально я поле ошибки я написал email и из-за этого тест падал
            return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'recoveryCode', message: 'code already confirmed' } };
        }
        //обновляем данные, если все четко
        await mongoDB_db_1.usersCollection.updateOne({ _id: user._id }, { $set: { "passwordRecovery.isConfirmed": true,
                "accountData.password": newPasswordHash
            } });
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
};
exports.AuthRepo = AuthRepo;
exports.AuthRepo = AuthRepo = __decorate([
    (0, inversify_1.injectable)()
], AuthRepo);
