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
exports.AuthService = void 0;
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
const authRepository_repository_1 = require("../../dataAcsessLayer/repository/authRepository.repository");
const inversify_1 = require("inversify");
const bcrypt_helper_1 = require("../../helpers/bcrypt.helper");
const usersService_bll_1 = require("../../../Entity/Users/BLL/usersService.bll");
const nodemailer_helper_1 = require("../../helpers/nodemailer.helper");
const uuid_1 = require("uuid");
// export const authService = {
//     async checkUserInfo(info: TypeAuthInputModel, dataToDb: TypeSessionInputData):Promise<IResult<{accessToken:string,refreshToken:string } | null>>{
//         //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
//         const {loginOrEmail, password} = info;
//         const user = await queryRepo.findUserByAuthOrFail(loginOrEmail, password);
//
//         //если не удалась аутентификация, то прерываем процесс авторизации
//         if(user.status !== ResultStatuses.success){
//             return {
//                 data: null,
//                 status: user.status
//             }
//         }
//
//         // создаем пару AccessToken и RefreshToken
//         const userId = user.data!.id;   //userID это MomgoID, которое присвоилось юзеру при регистрации
//         const accessToken = jwtHelper.generateAccessToken(userId);
//         const {refreshToken, deviceId} = jwtHelper.generateRefreshToken(userId);
//
//
//         //раскукоживаем payload (в payload сидит userId, jti, iat, exp = iat + expiresIn)
//         const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
//         if(!decodedRefresh){
//             return {data:null, status: ResultStatuses.error}
//         }
//         //создаем экземпляр сессии
//         const session:TypeSessionModel = {
//             userId: userId,
//             deviceId: deviceId,
//             ip: dataToDb.ip,
//             deviceName: dataToDb.deviceName,
//             lastActivity: new Date(decodedRefresh.iat!*1000),
//             expiresAt: new Date(decodedRefresh.exp!*1000),
//             revoked: false
//         }
//         //сохраняем в БД
//         await authRepo.addSession(session);
//         return {
//             data: {accessToken,refreshToken},
//             status: user.status
//         }
//     },
//     async updateRefreshToken(refreshToken:string): Promise<IResult<null | {accessToken: string, refreshToken: string}>> {
//         //раскукоживаем рефреш-токен и получаем оттуда данные
//         const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
//         if (!decodedRefresh) {
//             return {data:null, status:ResultStatuses.unauthorized}
//         }
//         const result = await authRepo.updateTokens(decodedRefresh!);
//         return {data: result.data, status: result.status, errorMessage: result.errorMessage}
//     },
//     async removeRefreshToken(refreshToken:string): Promise<IResult<null>> {
//         const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
//         if(!decodedRefresh){
//             return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'refreshToken', message: 'Refresh token is empty'}};
//         }
//
//         const result = await authRepo.removeRefreshToken(decodedRefresh);
//         return {data: result.data, status: result.status}
//     }
// }
let AuthService = class AuthService {
    constructor(queryRepo, authRepo) {
        this.queryRepo = queryRepo;
        this.authRepo = authRepo;
    }
    async checkUserInfo(info, dataToDb) {
        //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
        const { loginOrEmail, password } = info;
        const user = await this.queryRepo.findUserByAuthOrFail(loginOrEmail, password);
        //если не удалась аутентификация, то прерываем процесс авторизации
        if (user.status !== ResultObject_type_1.ResultStatuses.success) {
            return {
                data: null,
                status: user.status
            };
        }
        // создаем пару AccessToken и RefreshToken
        const userId = user.data.id; //userID это MomgoID, которое присвоилось юзеру при регистрации
        const accessToken = jwt_helper_1.jwtHelper.generateAccessToken(userId);
        const { refreshToken, deviceId } = jwt_helper_1.jwtHelper.generateRefreshToken(userId);
        //раскукоживаем payload (в payload сидит userId, jti, iat, exp = iat + expiresIn)
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.error };
        }
        //создаем экземпляр сессии
        const session = {
            userId: userId,
            deviceId: deviceId,
            ip: dataToDb.ip,
            deviceName: dataToDb.deviceName,
            lastActivity: new Date(decodedRefresh.iat * 1000),
            expiresAt: new Date(decodedRefresh.exp * 1000),
            revoked: false
        };
        //сохраняем в БД
        await this.authRepo.addSession(session);
        return {
            data: { accessToken, refreshToken },
            status: user.status
        };
    }
    async updateRefreshToken(refreshToken) {
        //раскукоживаем рефреш-токен и получаем оттуда данные
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        const result = await this.authRepo.updateTokens(decodedRefresh);
        return { data: result.data, status: result.status, errorMessage: result.errorMessage };
    }
    async removeRefreshToken(refreshToken) {
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized, errorMessage: { field: 'refreshToken', message: 'Refresh token is empty' } };
        }
        const result = await this.authRepo.removeRefreshToken(decodedRefresh);
        return { data: result.data, status: result.status };
    }
    async recoveryPassword(email) {
        //отдаем в repository и если такой есть, то отправляем туда код
        const confirmationCode = (0, uuid_1.v4)();
        const result = await this.authRepo.recoveryPassword(email, confirmationCode);
        if (result.status === ResultObject_type_1.ResultStatuses.notFound) {
            return;
        }
        //отправляем письмо на почту для подтверждения
        await nodemailer_helper_1.nodemailerHelper.sendPasswordRecoveryCode(email, confirmationCode);
        return;
    }
    async setNewPassword(code, newPassword) {
        //отдаем код и пароль в репозиторий, если код ок, то обновляем запись о пароле
        const newPasswordHash = await bcrypt_helper_1.bcryptHelper.generateHash(newPassword, usersService_bll_1.SALT_ROUNDS);
        const result = await this.authRepo.setNewPassword(code, newPasswordHash);
        return { data: result.data, status: result.status, errorMessage: result.errorMessage };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(authRepository_repository_1.AuthRepo)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        authRepository_repository_1.AuthRepo])
], AuthService);
