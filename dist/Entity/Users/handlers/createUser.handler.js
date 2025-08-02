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
exports.createUserHandler = createUserHandler;
const usersService_bll_1 = require("../BLL/usersService.bll");
const ResultObject_type_1 = require("../../../core/types/ResultObject.type");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //получили данные из req body
        const userInput = req.body;
        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = yield usersService_bll_1.usersService.createUser(userInput);
        //результат работы по созданию юзера
        if (newUserResult.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Created).send(newUserResult.data);
    });
}
