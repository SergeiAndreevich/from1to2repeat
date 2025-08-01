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
exports.authService = void 0;
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const jwt_helper_1 = require("../../helpers/jwt.helper");
exports.authService = {
    checkUserInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            const { loginOrEmail, password } = info;
            const doesUserExist = yield queryRepo_repository_1.queryRepo.findUserByAuthOrFail(loginOrEmail, password);
            if (doesUserExist.status === ResultObject_type_1.ResultStatuses.success) {
                const acsessToken = yield jwt_helper_1.jwtHelper.createToken(doesUserExist.data);
                return {
                    data: acsessToken,
                    status: doesUserExist.status
                };
            }
            return {
                data: null,
                status: doesUserExist.status
            };
        });
    }
};
