"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectionService = void 0;
const ResultObject_type_1 = require("../../types/ResultObject.type");
const inversify_1 = require("inversify");
const protectionRepo_repository_1 = require("../DAL/protectionRepo.repository");
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
let ProtectionService = class ProtectionService {
    constructor(protectionRepo) {
        this.protectionRepo = protectionRepo;
    }
    async checkClicks(IP, URL) {
        // Добавляем текущий запрос в БД
        const newRequest = {
            IP: IP,
            URL: URL,
            date: new Date()
        };
        await this.protectionRepo.addRequest(newRequest);
        // Проверяем количество запросов за последние 10 секунд
        const requestsCount = await this.protectionRepo.getRequestsCount(IP, URL);
        // Лимит: 5 запросов за 10 секунд
        if (requestsCount > 5) {
            console.log(`Rate limit exceeded for IP: ${IP}, URL: ${URL}, count: ${requestsCount}`);
            return { data: null, status: ResultObject_type_1.ResultStatuses.manyRequests };
        }
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
};
exports.ProtectionService = ProtectionService;
exports.ProtectionService = ProtectionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(protectionRepo_repository_1.ProtectionRepo)),
    __metadata("design:paramtypes", [protectionRepo_repository_1.ProtectionRepo])
], ProtectionService);
