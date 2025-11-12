"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.antiClicker = antiClicker;
const ResultObject_type_1 = require("../types/ResultObject.type");
const httpStatuses_type_1 = require("../types/httpStatuses.type");
const composition_root_1 = require("../../composition-root");
const protectionService_bll_1 = require("./BLL/protectionService.bll");
const protectionService = composition_root_1.container.get(protectionService_bll_1.ProtectionService);
async function antiClicker(req, res, next) {
    //получаем IP и URL
    const IP = req.ip || req.socket.remoteAddress || 'unknown';
    const URL = req.originalUrl || req.baseUrl;
    //// Используем метод + путь для большей гранулярности
    //const endpoint = `${req.method} ${req.baseUrl}${req.path}`;
    // Для тестирования можно добавить логирование
    console.log(`Rate limit check: IP=${IP}, URL=${URL}`);
    const result = await protectionService.checkClicks(IP, URL);
    if (result.status !== ResultObject_type_1.ResultStatuses.success) {
        res.sendStatus(httpStatuses_type_1.httpStatus.TooManyRequests);
        return;
    }
    next();
}
