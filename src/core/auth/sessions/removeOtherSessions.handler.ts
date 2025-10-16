import {Request, Response} from 'express';
import {httpStatus} from "../../types/httpStatuses.type";
import {sessionsService} from "../BLL/sessionsService.bll";
import {ResultStatuses} from "../../types/ResultObject.type";

export async function removeOtherSessionsHandler(req: Request, res: Response) {
    //
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    const result = await sessionsService.removeOtherSessions(refreshToken);
    if(result.status !== ResultStatuses.success){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    res.sendStatus(httpStatus.NoContent)
}