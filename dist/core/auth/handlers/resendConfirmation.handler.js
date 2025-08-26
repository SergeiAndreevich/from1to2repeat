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
function resendConfirmationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = yield queryRepo_repository_1.queryRepo.checkEmailConfirmation(req.body);
        if (!email) {
            res.sendStatus(httpStatuses_type_1.httpStatus.BadRequest);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.NoContent).send({ message: 'Confirmation code is re-sent' });
        //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)
        //ну и 400 если некорректная почта или уже подтверждена
    });
}
