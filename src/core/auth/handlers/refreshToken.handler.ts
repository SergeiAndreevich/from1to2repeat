import {Request, Response} from "express";
import cookieParser from "cookie-parser";
import {httpStatus} from "../../types/httpStatuses.type";
import {authService} from "../BLL/authService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";


export async function refreshHandler(req: Request, res: Response){
    //проверяем,пришел ли в куки рефреш-токен
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    //оищем, обновляем пару
    const result = await authService.updateRefreshToken(refreshToken);
    if(result.status !== ResultStatuses.success){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    //отправляем пользователю
    res.cookie("refresh_token", result.data!.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 20 * 1000 // 20 secund в ms
    });
    res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken})
}