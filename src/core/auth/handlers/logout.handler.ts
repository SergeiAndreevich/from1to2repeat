import {Request, Response} from "express";
import {httpStatus} from "../../types/httpStatuses.type";
import {authService} from "../BLL/authService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";

export async function logoutHandler(req: Request, res: Response): Promise<void> {
    // check actual token
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken) {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    // вносим изменения в БД, т.е. протухаем существующий токен
    const result = await authService.removeRefreshToken(refreshToken);

    //проверяем статус того че пришло из БД
    if(result.status !== ResultStatuses.success){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }

    //очищаем куки и возвращаем ответочку
    res.clearCookie("refresh_token");
    res.sendStatus(httpStatus.NoContent)
}