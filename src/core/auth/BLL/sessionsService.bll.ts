import {SessionsRepo} from "../../dataAcsessLayer/repository/sessionsRepository.repository";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";
import {TypeSessionToViewModel} from "../auth.types";
import {inject, injectable} from "inversify";

// export const sessionsService = {
//     async getSessions(userId:string) {
//         return await sessionsRepo.findSessionsByUserId(userId)
//     },
//     async removeOtherSessions(refreshToken: string){
//         const payload = jwtHelper.verifyRefreshToken(refreshToken);
//         if(!payload){
//             return {data:null, status:ResultStatuses.unauthorized}
//         }
//         const result = await sessionsRepo.removeOtherSessions(payload);
//         return {data:result.data, status:result.status}
//     },
//     async removeThisSession(session: TypeSessionToViewModel&{userId:string}, refreshToken:string):Promise<IResult<null | string>> {
//         //проверяем рефреш-токен
//         const payload = jwtHelper.verifyRefreshToken(refreshToken);
//         if(!payload) {
//             return {data: null, status: ResultStatuses.unauthorized}
//         }
//         //свою ли сессию чел завершает?
//         const isItYourDevice = await sessionsRepo.compareSessions(payload,session);
//         if(isItYourDevice === ResultStatuses.forbidden) {
//             return {data: null, status: ResultStatuses.forbidden}
//         }
//         if(isItYourDevice === ResultStatuses.notFound){
//             return {data: null, status: ResultStatuses.notFound}
//         }
//
//         //теперь нужно удалить
//         await sessionsRepo.removeThisSession(session.deviceId);
//         return {data: null, status: ResultStatuses.success}
//     }
// }

@injectable()
export class SessionsService {
    constructor(@inject(SessionsRepo) protected sessionsRepo: SessionsRepo) {}
    async getSessions(userId:string) {
        return await this.sessionsRepo.findSessionsByUserId(userId)
    }
    async removeOtherSessions(refreshToken: string){
        const payload = jwtHelper.verifyRefreshToken(refreshToken);
        if(!payload){
            return {data:null, status:ResultStatuses.unauthorized}
        }
        const result = await this.sessionsRepo.removeOtherSessions(payload);
        return {data:result.data, status:result.status}
    }
    async removeThisSession(session: TypeSessionToViewModel&{userId:string}, refreshToken:string):Promise<IResult<null | string>> {
        //проверяем рефреш-токен
        const payload = jwtHelper.verifyRefreshToken(refreshToken);
        if(!payload) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        //свою ли сессию чел завершает?
        const isItYourDevice = await this.sessionsRepo.compareSessions(payload,session);
        if(isItYourDevice === ResultStatuses.forbidden) {
            return {data: null, status: ResultStatuses.forbidden}
        }
        if(isItYourDevice === ResultStatuses.notFound){
            return {data: null, status: ResultStatuses.notFound}
        }

        //теперь нужно удалить
        await this.sessionsRepo.removeThisSession(session.deviceId);
        return {data: null, status: ResultStatuses.success}
    }
}

