import {TypeAuthInputModel, TypeSessionInputData, TypeSessionModel} from "../auth.types";
import {QueryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {AuthRepo} from "../../dataAcsessLayer/repository/authRepository.repository";
import {inject, injectable} from "inversify";
import {bcryptHelper} from "../../helpers/bcrypt.helper";
import {SALT_ROUNDS} from "../../../Entity/Users/BLL/usersService.bll";
import {nodemailerHelper} from "../../helpers/nodemailer.helper";
import {v4 as uuidv4} from "uuid";

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

@injectable()
export class AuthService {
    constructor(@inject(QueryRepo) protected queryRepo: QueryRepo,
                @inject(AuthRepo) protected authRepo: AuthRepo) {
    }
    async checkUserInfo(info: TypeAuthInputModel, dataToDb: TypeSessionInputData):Promise<IResult<{accessToken:string,refreshToken:string } | null>>{
        //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
        const {loginOrEmail, password} = info;
        const user = await this.queryRepo.findUserByAuthOrFail(loginOrEmail, password);
        //если не удалась аутентификация, то прерываем процесс авторизации
        if(user.status !== ResultStatuses.success){
            return {
                data: null,
                status: user.status
            }
        }
        // создаем пару AccessToken и RefreshToken
        const userId = user.data!.id;   //userID это MomgoID, которое присвоилось юзеру при регистрации
        const accessToken = jwtHelper.generateAccessToken(userId);
        const {refreshToken, deviceId} = jwtHelper.generateRefreshToken(userId);
        //раскукоживаем payload (в payload сидит userId, jti, iat, exp = iat + expiresIn)
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            return {data:null, status: ResultStatuses.error}
        }
        //создаем экземпляр сессии
        const session:TypeSessionModel = {
            userId: userId,
            deviceId: deviceId,
            ip: dataToDb.ip,
            deviceName: dataToDb.deviceName,
            lastActivity: new Date(decodedRefresh.iat!*1000),
            expiresAt: new Date(decodedRefresh.exp!*1000),
            revoked: false
        }
        //сохраняем в БД
        await this.authRepo.addSession(session);
        return {
            data: {accessToken,refreshToken},
            status: user.status
        }
    }
    async updateRefreshToken(refreshToken:string): Promise<IResult<null | {accessToken: string, refreshToken: string}>> {
        //раскукоживаем рефреш-токен и получаем оттуда данные
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return {data:null, status:ResultStatuses.unauthorized}
        }
        const result = await this.authRepo.updateTokens(decodedRefresh!);
        return {data: result.data, status: result.status, errorMessage: result.errorMessage}
    }
    async removeRefreshToken(refreshToken:string): Promise<IResult<null>> {
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'refreshToken', message: 'Refresh token is empty'}};
        }

        const result = await this.authRepo.removeRefreshToken(decodedRefresh);
        return {data: result.data, status: result.status}
    }
    async recoveryPassword(email:string): Promise<void> {
        //отдаем в repository и если такой есть, то отправляем туда код
        const confirmationCode = uuidv4();
        const result = await this.authRepo.recoveryPassword(email, confirmationCode);
        if(result.status === ResultStatuses.notFound){
            return
        }
        //отправляем письмо на почту для подтверждения
        await nodemailerHelper.sendPasswordRecoveryCode(email, confirmationCode);
        return
    }
    async setNewPassword(code: string, newPassword: string): Promise<IResult>{
        //отдаем код и пароль в репозиторий, если код ок, то обновляем запись о пароле
        const newPasswordHash = await bcryptHelper.generateHash(newPassword, SALT_ROUNDS);
        const result = await this.authRepo.setNewPassword(code, newPasswordHash);
        return {data: result.data, status: result.status, errorMessage: result.errorMessage}
    }
}

