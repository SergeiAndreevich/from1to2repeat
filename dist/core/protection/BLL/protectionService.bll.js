"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectionService = void 0;
const protectionRepo_repository_1 = require("../DAL/protectionRepo.repository");
const ResultObject_type_1 = require("../../types/ResultObject.type");
exports.protectionService = {
    checkClicks(IP, URL) {
        return __awaiter(this, void 0, void 0, function* () {
            // Добавляем текущий запрос в БД
            const newRequest = {
                IP: IP,
                URL: URL,
                date: new Date()
            };
            yield protectionRepo_repository_1.protectionRepo.addRequest(newRequest);
            // Проверяем количество запросов за последние 10 секунд
            const requestsCount = yield protectionRepo_repository_1.protectionRepo.getRequestsCount(IP, URL);
            // Лимит: 5 запросов за 10 секунд
            if (requestsCount > 5) {
                console.log(`Rate limit exceeded for IP: ${IP}, URL: ${URL}, count: ${requestsCount}`);
                return { data: null, status: ResultObject_type_1.ResultStatuses.manyRequests };
            }
            return { data: null, status: ResultObject_type_1.ResultStatuses.success };
        });
    }
};
