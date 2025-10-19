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
exports.antiClicker = antiClicker;
const protectionService_bll_1 = require("./BLL/protectionService.bll");
const ResultObject_type_1 = require("../types/ResultObject.type");
const httpStatuses_type_1 = require("../types/httpStatuses.type");
function antiClicker(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //получаем IP и URL
        const IP = req.ip || req.socket.remoteAddress || 'unknown';
        const URL = req.originalUrl || req.baseUrl;
        //// Используем метод + путь для большей гранулярности
        //const endpoint = `${req.method} ${req.baseUrl}${req.path}`;
        // Для тестирования можно добавить логирование
        console.log(`Rate limit check: IP=${IP}, URL=${URL}`);
        const result = yield protectionService_bll_1.protectionService.checkClicks(IP, URL);
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.TooManyRequests);
            return;
        }
        next();
    });
}
