import {Request, Response} from "express";
import cookieParser from "cookie-parser";
import {httpStatus} from "../../types/httpStatuses.type";
import {authService} from "../BLL/authService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {factory} from "ts-jest/dist/transformers/hoist-jest";


export async function refreshHandler(req: Request, res: Response){
    //console.log('______START REFRESH_TOKEN HANDLER______')
    //проверяем,пришел ли в куки рефреш-токен
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    // ВАЖНО: Сначала проверяем валидность токена
    //ищем, обновляем пару
    const result = await authService.updateRefreshToken(refreshToken);
    if(result.status !== ResultStatuses.success){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    //отправляем пользователю
    res.cookie("refreshToken", result.data!.refreshToken, {
        httpOnly: true,
        secure: true,
        //secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        maxAge: 20 * 1000 // 20 secund в ms
    });
    res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken})
}
//идем в БД и проверяем, актуальный ли у нас рефреш-токен
//изменяем в БД данные по старому рефреш-токену
//создаем новую пару аксес-рефреш токенов
//выдаем их как результат
//а уже в хендлере аксес-токен отдаем в боди, а в куки зашиваем новый рефреш