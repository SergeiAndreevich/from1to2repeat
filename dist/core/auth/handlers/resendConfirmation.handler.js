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
exports.resendConfirmationHandler = resendConfirmationHandler;
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const usersService_bll_1 = require("../../../Entity/Users/BLL/usersService.bll");
function resendConfirmationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body; // достаём строку email
        //console.log('=== RESEND CONFIRMATION DEBUG ===');
        //console.log('1. Email received:', email);
        const userEmail = yield queryRepo_repository_1.queryRepo.checkEmailConfirmation(email);
        //console.log('2. checkEmailConfirmation result:', userEmail);
        if (!userEmail) {
            //console.log('3. ❌ Returning 400 - user not found or already confirmed');
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send({
                errorsMessages: [
                    {
                        "message": "bad request",
                        "field": "email"
                    }
                ]
            });
            return;
        }
        //Проблема:
        //В вашем коде после пункта 4 нет кода для:
        //-Генерации нового confirmation code
        //-Обновления пользователя в базе с новым кодом
        //-Отправки email с новым кодом
        const result = yield usersService_bll_1.usersService.updateConfirmationCode(email);
        //console.log('4. ✅ Sending new confirmation email');
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
        //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)
        //ну и 400 если некорректная почта или уже подтверждена
    });
}
