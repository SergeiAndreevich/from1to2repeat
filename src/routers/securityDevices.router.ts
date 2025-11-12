import {Request, Response, Router} from "express";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {deviceIdValidation} from "../core/validation/deviceIdValidation.validation";
import {container} from "../composition-root";
import {SecurityController} from "../classes/security";

export const securityRouter = Router({});
const securityController = container.get(SecurityController);
securityRouter
    .get('/devices', securityController.getAllDevicesHandler.bind(securityController))  //выдаем массив всех сессий
    .delete('/devices', securityController.removeOtherSessionsHandler.bind(securityController)) //протухаем все сессии, кроме текущей
    .delete('/devices/:deviceId', deviceIdValidation, checkValidationErrors, securityController.removeThisSessionHandler.bind(securityController)) //протухаем текущую сессию

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