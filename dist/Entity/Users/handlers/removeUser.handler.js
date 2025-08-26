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
exports.removeUserHandler = removeUserHandler;
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
const usersRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/usersRepository.repository");
function removeUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(userId);
        //отработали 404
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        yield usersRepository_repository_1.usersRepository.removeUser(user.id);
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    });
}
//должны отработать 204, 401 и 404
//в авторизации отработали 401
