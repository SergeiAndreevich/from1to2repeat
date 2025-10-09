import {Request, Response} from "express";
import cookieParser from "cookie-parser";
import {httpStatus} from "../../types/httpStatuses.type";
import {authService} from "../BLL/authService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";


export async function refreshHandler(req: Request, res: Response){
    //console.log('______START REFRESH_TOKEN HANDLER______')
    //проверяем,пришел ли в куки рефреш-токен
    const refreshToken = req.cookies.refreshToken;
    //console.log('DUBUGGER REFRESH-TOKEN', refreshToken);
    if(!refreshToken){
        console.log('refreshToken is empty');
        res.sendStatus(httpStatus.Unauthorized);
        return
    }

    // ВАЖНО: Сначала проверяем валидность токена
    const decodedToken = jwtHelper.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
        //console.log('refreshToken is invalid');
        return res.status(401).json({ message: 'Invalid refresh token' });
    }

    //оищем, обновляем пару
    const result = await authService.updateRefreshToken(refreshToken);
    //console.log('result. After updating refresh-token', result);
    if(result.status !== ResultStatuses.success){
        //console.log('refreshToken didnt update');
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