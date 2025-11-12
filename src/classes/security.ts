import {inject, injectable} from "inversify";
import {SessionsRepo} from "../core/dataAcsessLayer/repository/sessionsRepository.repository";
import {SessionsService} from "../core/auth/BLL/sessionsService.bll";
import {QueryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {Request, Response} from "express";
import {httpStatus} from "../core/types/httpStatuses.type";
import {jwtHelper} from "../core/helpers/jwt.helper";
import {ResultStatuses} from "../core/types/ResultObject.type";

@injectable()
export class SecurityController {
    constructor(@inject(SessionsRepo) protected sessionsRepo: SessionsRepo,
                @inject(SessionsService) protected sessionsService: SessionsService,
                @inject(QueryRepo) protected queryRepo: QueryRepo){
    }
    async getAllDevicesHandler(req:Request,res:Response){
        //условие гуарда здесь валидный рефреш токен. И только!
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        const sessions = await this.sessionsRepo.findSessionsByUserId(decodedRefresh.userId);
        if(sessions.length < 1){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(sessions)
    }
    async removeOtherSessionsHandler(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        const result = await this.sessionsService.removeOtherSessions(refreshToken);
        if(result.status !== ResultStatuses.success){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }
    async removeThisSessionHandler(req:Request, res: Response) {
        const deviceId = req.params.deviceId;
        const session = await this.queryRepo.findSession(deviceId);
        if(!session) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        const result = await this.sessionsService.removeThisSession(session, refreshToken);

        switch (result.status) {
            case ResultStatuses.forbidden:
                res.sendStatus(httpStatus.Forbidden)
                return
            case ResultStatuses.unauthorized:
                res.sendStatus(httpStatus.Unauthorized)
                return
            case ResultStatuses.success:
                res.sendStatus(httpStatus.NoContent)
                return
            case ResultStatuses.notFound:
                res.sendStatus(httpStatus.NotFound)
                return
            default:
                res.sendStatus(httpStatus.InternalServerError)
                return
        }
    }
}
