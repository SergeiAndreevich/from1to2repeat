"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const getAllDevices_handler_1 = require("../core/auth/sessions/getAllDevices.handler");
const removeOtherSessions_handler_1 = require("../core/auth/sessions/removeOtherSessions.handler");
const removeThisSession_handler_1 = require("../core/auth/sessions/removeThisSession.handler");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const deviceIdValidation_validation_1 = require("../core/validation/deviceIdValidation.validation");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter
    .get('/devices', getAllDevices_handler_1.getAllDevicesHandler) //выдаем массив всех сессий
    .delete('/devices', removeOtherSessions_handler_1.removeOtherSessionsHandler) //протухаем все сессии, кроме текущей
    .delete('/devices/:deviceId', deviceIdValidation_validation_1.deviceIdValidation, validationErrorResult_handler_1.checkValidationErrors, removeThisSession_handler_1.removeThisSessionHandler); //протухаем текущую сессию
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
