"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const sessionsRepository_repository_1 = require("../../dataAcsessLayer/repository/sessionsRepository.repository");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
const inversify_1 = require("inversify");
// export const sessionsService = {
//     async getSessions(userId:string) {
//         return await sessionsRepo.findSessionsByUserId(userId)
//     },
//     async removeOtherSessions(refreshToken: string){
//         const payload = jwtHelper.verifyRefreshToken(refreshToken);
//         if(!payload){
//             return {data:null, status:ResultStatuses.unauthorized}
//         }
//         const result = await sessionsRepo.removeOtherSessions(payload);
//         return {data:result.data, status:result.status}
//     },
//     async removeThisSession(session: TypeSessionToViewModel&{userId:string}, refreshToken:string):Promise<IResult<null | string>> {
//         //проверяем рефреш-токен
//         const payload = jwtHelper.verifyRefreshToken(refreshToken);
//         if(!payload) {
//             return {data: null, status: ResultStatuses.unauthorized}
//         }
//         //свою ли сессию чел завершает?
//         const isItYourDevice = await sessionsRepo.compareSessions(payload,session);
//         if(isItYourDevice === ResultStatuses.forbidden) {
//             return {data: null, status: ResultStatuses.forbidden}
//         }
//         if(isItYourDevice === ResultStatuses.notFound){
//             return {data: null, status: ResultStatuses.notFound}
//         }
//
//         //теперь нужно удалить
//         await sessionsRepo.removeThisSession(session.deviceId);
//         return {data: null, status: ResultStatuses.success}
//     }
// }
let SessionsService = class SessionsService {
    constructor(sessionsRepo) {
        this.sessionsRepo = sessionsRepo;
    }
    async getSessions(userId) {
        return await this.sessionsRepo.findSessionsByUserId(userId);
    }
    async removeOtherSessions(refreshToken) {
        const payload = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!payload) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        const result = await this.sessionsRepo.removeOtherSessions(payload);
        return { data: result.data, status: result.status };
    }
    async removeThisSession(session, refreshToken) {
        //проверяем рефреш-токен
        const payload = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!payload) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        //свою ли сессию чел завершает?
        const isItYourDevice = await this.sessionsRepo.compareSessions(payload, session);
        if (isItYourDevice === ResultObject_type_1.ResultStatuses.forbidden) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.forbidden };
        }
        if (isItYourDevice === ResultObject_type_1.ResultStatuses.notFound) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
        }
        //теперь нужно удалить
        await this.sessionsRepo.removeThisSession(session.deviceId);
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(sessionsRepository_repository_1.SessionsRepo)),
    __metadata("design:paramtypes", [sessionsRepository_repository_1.SessionsRepo])
], SessionsService);
