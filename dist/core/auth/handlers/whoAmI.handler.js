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
exports.whoAmIHandler = whoAmIHandler;
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
function whoAmIHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(userId);
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send({ email: user === null || user === void 0 ? void 0 : user.email, login: user === null || user === void 0 ? void 0 : user.login, userId: user === null || user === void 0 ? void 0 : user.id });
    });
}
