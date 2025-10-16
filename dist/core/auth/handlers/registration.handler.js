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
exports.registrationHandler = registrationHandler;
const usersService_bll_1 = require("../../../Entity/Users/BLL/usersService.bll");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
const createErrorsMessage_function_1 = require("../../errors/createErrorsMessage.function");
function registrationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //пришли login, email, password
        //204 - если входящие данные приняты. Код подтверждения вскоре будет выслан на указанную почту
        // код в ссылке как квери-параметр, например, ляляля?code=yourcode
        //ну и 400, еслу юзер уже есть (а также если некорректный инпут)
        //console.log('=== REGISTRATION DEBUG ===');
        //console.log('1. NODE_ENV:', process.env.NODE_ENV);
        const userInput = req.body;
        //console.log('2. User input:', userInput);
        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = yield usersService_bll_1.usersService.createUser(userInput);
        //console.log('3. Service result status:', newUserResult);
        //результат работы по созданию юзера
        if (newUserResult.status === ResultObject_type_1.ResultStatuses.alreadyExist) {
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send((0, createErrorsMessage_function_1.createErrorsMessages)(newUserResult.errorMessage));
            return;
        }
        const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(newUserResult.data.id);
        //console.log('4. User found:', user);
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        //console.log('5. 🔒 Sending response WITHOUT code for production');
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
        //res.sendStatus(204)
        // ⭐ В ТЕСТОВОЙ СРЕДЕ ВОЗВРАЩАЕМ КОД ⭐
        //if (process.env.NODE_ENV === 'test') {
        //     res.status(httpStatus.NoContent).send({
        //         message: 'confirmation code is sent to your email',
        //         confirmationCode: newUserResult.data!.code // ← добавляем код для теста
        //      });
        // } else {
        //     res.status(httpStatus.NoContent).send({
        //         message: 'confirmation code is sent to your email'
        //     });
        // }
        //res.status(httpStatus.NoContent).send({message: 'confirmation code is sent to your email'})
    });
}
