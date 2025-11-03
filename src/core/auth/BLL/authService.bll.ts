import {TypeAuthInputModel, TypeSessionInputData, TypeSessionModel} from "../auth.types";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {authRepo} from "../../dataAcsessLayer/repository/authRepository.repository";

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

class AuthService {
    async checkUserInfo(info: TypeAuthInputModel, dataToDb: TypeSessionInputData):Promise<IResult<{accessToken:string,refreshToken:string } | null>>{
        //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
        const {loginOrEmail, password} = info;
        const user = await queryRepo.findUserByAuthOrFail(loginOrEmail, password);

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
        await authRepo.addSession(session);
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
        const result = await authRepo.updateTokens(decodedRefresh!);
        return {data: result.data, status: result.status, errorMessage: result.errorMessage}
    }
    async removeRefreshToken(refreshToken:string): Promise<IResult<null>> {
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'refreshToken', message: 'Refresh token is empty'}};
        }

        const result = await authRepo.removeRefreshToken(decodedRefresh);
        return {data: result.data, status: result.status}
    }
    async recoveryPassword(email:string): Promise<void> {
        //отдаем в repository и если такой есть, то отправляем туда код
        const result = await authRepo.recoveryPassword(email);
        return result
    }
    async setNewPassword(code: string, newPassword: string){
        //отдаем код и пароль в репозиторий, если код ок, то обновляем запись о пароле
        const result = await authRepo.setNewPassword(code, newPassword);
        return result
    }
}

export const authService =  new AuthService();