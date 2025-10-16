import {Request, Response} from "express";
import {authService} from "../BLL/authService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";
import {httpStatus} from "../../types/httpStatuses.type";

export async function authHandler(req:Request, res:Response){
    const ip = req.ip;
    if(!ip){
        res.sendStatus(httpStatus.Forbidden);
        return
    }
    const deviceName = req.headers['user-agent']  || 'Unknown device';
    //проверяем, есть ли такой юзер. Если есть и все данные сходятся - выдаем токены
    const result = await authService.checkUserInfo(req.body, {ip, deviceName});
    switch (result.status) {
        case ResultStatuses.notFound:
            res.sendStatus(httpStatus.NotFound);
            break
        case ResultStatuses.unauthorized:
            res.sendStatus(httpStatus.Unauthorized);
            break
        case ResultStatuses.success:
            res.cookie("refreshToken", result.data!.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 20 * 1000 // 20 secund в ms
            });
            res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken});
            console.log("При логинизации создался SET-COOKIE:", res.getHeaders()['set-cookie']);
            break
        default:
            res.sendStatus(httpStatus.InternalServerError)
            break
    }

}
//400 - ошибка валидации
//401 - неправильные данные для входа (не совпало с БД)
//429 - больше 5 попыток авторизации за 10 секунд с одного ip-адреса


