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
function registrationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //пришли login, email, password
        //204 - если входящие данные приняты. Код подтверждения вскоре будет выслан на указанную почту
        // код в ссылке как квери-параметр, например, ляляля?code=yourcode
        //ну и 400, еслу юзер уже есть (а также если некорректный инпут)
        const userInput = req.body;
        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = yield usersService_bll_1.usersService.createUser(userInput);
        //результат работы по созданию юзера
        if (newUserResult.status === ResultObject_type_1.ResultStatuses.alreadyExist) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(newUserResult.data);
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.NoContent).send({ message: 'confirmation code is sent to your email' });
    });
}
