import {Request, Response, Router} from "express";
import {getAllDevicesHandler} from "../core/auth/sessions/getAllDevices.handler";
import {removeOtherSessionsHandler} from "../core/auth/sessions/removeOtherSessions.handler";
import {removeThisSessionHandler} from "../core/auth/sessions/removeThisSession.handler";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {deviceIdValidation} from "../core/validation/deviceIdValidation.validation";
import {sessionsRepo, SessionsRepo} from "../core/dataAcsessLayer/repository/sessionsRepository.repository";
import {httpStatus} from "../core/types/httpStatuses.type";
import {jwtHelper} from "../core/helpers/jwt.helper";
import {SessionsService, sessionsService} from "../core/auth/BLL/sessionsService.bll";
import {ResultStatuses} from "../core/types/ResultObject.type";
import {QueryRepo, queryRepo} from "../core/dataAcsessLayer/queryRepo.repository";

export const securityRouter = Router({});

class SecurityController {
    private sessionsRepo: SessionsRepo;
    private sessionsService: SessionsService;
    private queryRepo: QueryRepo;
    constructor(){
        this.sessionsRepo = new SessionsRepo();
        this.sessionsService = new SessionsService();
        this.queryRepo = new QueryRepo();
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
const securityController = new SecurityController();

securityRouter
    .get('/devices', securityController.getAllDevicesHandler.bind(securityController))  //выдаем массив всех сессий
    .delete('/devices', securityController.removeOtherSessionsHandler.bind(securityController)) //протухаем все сессии, кроме текущей
    .delete('/devices/:deviceId', deviceIdValidation, checkValidationErrors, securityController.removeThisSessionHandler.bind(securityController)) //протухаем текущую сессию

//может быть не надо делать токен гуард, а простот в хенждлере вытаскивать РТ и если его нет то анавторайзд


//короче, при GET./devices получаем из куки refreshToken, проверяем его и отдаем в БД
//в БД ищем все сессии, у которых [userId: userId, revoked:false] и мапим массив для нужного вида

//при DELETE./devices берем refreshToken, идем в БД и достаем [userId, deviceId],
//по userId, deviceId != нашему и revoked:false ищем все активные сессии кроме нашей, deleteMany
// (updateMany, revoked: true) не до конца понятно, как лучше

//при DELETE./devices/:deviceId достаем после валидации deviceId из params,
//ищем по deviceId в БД такую сессию, не нашли 404, нашли?проверяем refreshToken
//отдаем в сервис найденную сессию и refreshToken, проверяем что устройство принадлежит юзеру по рефреш-токену
//достаем из неё deviceId[refreshToken, бывший jti], верифицируем,
//проверяем, свою ли сессию завершает (ищем сессию по рефреш-токену и сравниваем с той, что уже нашли по params)
//если всё ок, то отдаём deviceId на удаление в БД
//механика удаления не совсем понятна: надо удалить из БД или просто revoked:true сделать