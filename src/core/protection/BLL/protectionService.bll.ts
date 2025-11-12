import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {TypeRateLimitModel} from "../Protection.types";
import {inject, injectable} from "inversify";
import {ProtectionRepo} from "../DAL/protectionRepo.repository";

// export const protectionService = {
//     async checkClicks (IP: string, URL:string):Promise<IResult> {
//         // Добавляем текущий запрос в БД
//         const newRequest:TypeRateLimitModel = {
//             IP: IP,
//             URL: URL,
//             date: new Date()
//         }
//         await protectionRepo.addRequest(newRequest);
//
//         // Проверяем количество запросов за последние 10 секунд
//         const requestsCount = await protectionRepo.getRequestsCount(IP,URL);
//
//         // Лимит: 5 запросов за 10 секунд
//         if (requestsCount > 5) {
//             console.log(`Rate limit exceeded for IP: ${IP}, URL: ${URL}, count: ${requestsCount}`);
//             return {data:null, status:ResultStatuses.manyRequests}
//         }
//         return {data:null, status:ResultStatuses.success}
//     }
// }

@injectable()
export class ProtectionService {
    constructor(@inject(ProtectionRepo) protected protectionRepo: ProtectionRepo) {
    }
    async checkClicks (IP: string, URL:string):Promise<IResult> {
        // Добавляем текущий запрос в БД
        const newRequest:TypeRateLimitModel = {
            IP: IP,
            URL: URL,
            date: new Date()
        }
        await this.protectionRepo.addRequest(newRequest);

        // Проверяем количество запросов за последние 10 секунд
        const requestsCount = await this.protectionRepo.getRequestsCount(IP,URL);

        // Лимит: 5 запросов за 10 секунд
        if (requestsCount > 5) {
            console.log(`Rate limit exceeded for IP: ${IP}, URL: ${URL}, count: ${requestsCount}`);
            return {data:null, status:ResultStatuses.manyRequests}
        }
        return {data:null, status:ResultStatuses.success}
    }
}
