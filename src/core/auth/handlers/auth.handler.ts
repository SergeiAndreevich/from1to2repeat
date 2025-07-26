import {Request, Response} from "express";
import {authService} from "../BLL/authService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";
import {httpStatus} from "../../types/httpStatuses.type";

export async function authHandler(req:Request, res:Response){
    //проверяем, есть ли такой юзер. Если есть и все данные сходятся - выдаем токен
    const result = await authService.checkUserInfo(req.body);
    switch (result.status) {
        case ResultStatuses.notFound:
            res.status(httpStatus.NotFound);
            break
        case ResultStatuses.unauthorized:
            res.status(httpStatus.Unauthorized);
            break
        case ResultStatuses.success:
            res.status(httpStatus.Ok).send({accessToken: result.data})
            break
        default:
            res.sendStatus(httpStatus.InternalServerError)
            break
    }

}
