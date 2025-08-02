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
const ResultObject_type_1 = require("../../../core/types/ResultObject.type");
const repository_repository_1 = require("../../../core/dataAcsessLayer/repository.repository");
function removeUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(userId);
        if (user.status === ResultObject_type_1.ResultStatuses.notFound) {
            res.sendStatus(404);
            return;
        }
        yield repository_repository_1.repository.removeUser(user.data.id);
        res.sendStatus(204);
    });
}
