import {TypeRateLimitModel} from "../Protection.types";
import {protectionCollection} from "../../db/mongoDB.db";
import {inject, injectable} from "inversify";

// export const protectionRepo = {
//     async addRequest(newRepuest:TypeRateLimitModel){
//         await protectionCollection.insertOne(newRepuest);
//         return
//     },
//     async getRequestsCount(IP:string, URL:string):Promise<number> {
//         const timeThreshold = new Date(Date.now() - 10 * 1000);
//
//         return await protectionCollection.countDocuments({
//             IP,
//             URL,
//             date: { $gte: timeThreshold }
//         });
//     },
//     async cleanupOldRequests(): Promise<void> {
//         // Очищаем записи старше 1 часа для оптимизации
//         const timer = new Date(Date.now() - 60 * 60 * 1000);
//         await protectionCollection.deleteMany({
//             date: { $lt: timer }
//         });
//     }
// }

@injectable()
export class ProtectionRepo {
    async addRequest(newRepuest:TypeRateLimitModel){
        await protectionCollection.insertOne(newRepuest);
        return
    }
    async getRequestsCount(IP:string, URL:string):Promise<number> {
        const timeThreshold = new Date(Date.now() - 10 * 1000);

        return await protectionCollection.countDocuments({
            IP,
            URL,
            date: { $gte: timeThreshold }
        });
    }
    async cleanupOldRequests(): Promise<void> {
        // Очищаем записи старше 1 часа для оптимизации
        const timer = new Date(Date.now() - 60 * 60 * 1000);
        await protectionCollection.deleteMany({
            date: { $lt: timer }
        });
    }
}

