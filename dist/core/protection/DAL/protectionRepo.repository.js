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
exports.protectionRepo = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
exports.protectionRepo = {
    addRequest(newRepuest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.protectionCollection.insertOne(newRepuest);
            return;
        });
    },
    getRequestsCount(IP, URL) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeThreshold = new Date(Date.now() - 10 * 1000);
            return yield mongoDB_db_1.protectionCollection.countDocuments({
                IP,
                URL,
                date: { $gte: timeThreshold }
            });
        });
    },
    cleanupOldRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            // Очищаем записи старше 1 часа для оптимизации
            const timer = new Date(Date.now() - 60 * 60 * 1000);
            yield mongoDB_db_1.protectionCollection.deleteMany({
                date: { $lt: timer }
            });
        });
    }
};
