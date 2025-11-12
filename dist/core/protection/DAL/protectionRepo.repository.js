"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectionRepo = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const inversify_1 = require("inversify");
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
let ProtectionRepo = class ProtectionRepo {
    async addRequest(newRepuest) {
        await mongoDB_db_1.protectionCollection.insertOne(newRepuest);
        return;
    }
    async getRequestsCount(IP, URL) {
        const timeThreshold = new Date(Date.now() - 10 * 1000);
        return await mongoDB_db_1.protectionCollection.countDocuments({
            IP,
            URL,
            date: { $gte: timeThreshold }
        });
    }
    async cleanupOldRequests() {
        // Очищаем записи старше 1 часа для оптимизации
        const timer = new Date(Date.now() - 60 * 60 * 1000);
        await mongoDB_db_1.protectionCollection.deleteMany({
            date: { $lt: timer }
        });
    }
};
exports.ProtectionRepo = ProtectionRepo;
exports.ProtectionRepo = ProtectionRepo = __decorate([
    (0, inversify_1.injectable)()
], ProtectionRepo);
