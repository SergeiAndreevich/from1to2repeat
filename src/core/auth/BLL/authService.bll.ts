import {TypeAuthInputModel} from "../auth.types";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {authRepo, TypeAccessDataModel} from "../../dataAcsessLayer/repository/authRepository.repository";
import {httpStatus} from "../../types/httpStatuses.type";

export const authService = {
    async checkUserInfo(info: TypeAuthInputModel):Promise<IResult<{accessToken:string,refreshToken:string } | null>>{
        //проверяем, есть ли такой юзер и совпадают ли данные аутентификации
        const {loginOrEmail, password} = info;
        const doesUserExist = await queryRepo.findUserByAuthOrFail(loginOrEmail, password);

        //если не удалась аутентификация, то прерываем процесс авторизации
        if(doesUserExist.status !== ResultStatuses.success){
            return {
                data: null,
                status: doesUserExist.status
            }
        }

        // создаем пару AccessToken и RefreshToken
        const userId = doesUserExist.data!.id;
        const accessToken = await jwtHelper.generateAccessToken(userId);
        const {refreshToken, jti} = await jwtHelper.generateRefreshToken(userId);

        //сохраняем в БД
        const decodedRefresh = await jwtHelper.verifyRefreshToken(refreshToken);
        const tokenToDb:TypeAccessDataModel = {
            jti,
            userId,
            expiresAt: new Date(decodedRefresh!.exp!* 1000),
            revoked: false
        }
        await authRepo.addRefreshToken(tokenToDb);


        return {
            data: {accessToken,refreshToken},
            status: doesUserExist.status
        }
    },
    async updateRefreshToken(refreshToken:string): Promise<IResult<null | {accessToken: string, refreshToken: string}>> {
        //раскукоживаем рефреш-токен и получаем оттуда данные
        const decodedRefresh = await jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'refreshToken', message: 'Refresh token is empty'}};
        }
        //идем в БД и проверяем, актуальный ли у нас рефреш-токен
        //изменяем в БД данные по старому рефреш-токену
        //создаем новую пару аксес-рефреш токенов
        //выдаем их как результат
        //а уже в хендлере аксес-токен отдаем в боди, а в куки зашиваем новый рефреш
        const result = await authRepo.updateTokens(decodedRefresh);
        return {data: result.data, status: result.status, errorMessage: result.errorMessage}
    },
    async removeRefreshToken(refreshToken:string): Promise<IResult<null>> {
        const decodedRefresh = await jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'refreshToken', message: 'Refresh token is empty'}};
        }

        const result = await authRepo.removeRefreshToken(decodedRefresh);
        return {data: result.data, status: result.status}
    }
}