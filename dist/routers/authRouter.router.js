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
exports.authRouter = void 0;
const express_1 = require("express");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const whoAmI_handler_1 = require("../core/auth/handlers/whoAmI.handler");
const inputAuthValidation_validation_1 = require("../core/validation/inputAuthValidation.validation");
const authService_bll_1 = require("../core/auth/BLL/authService.bll");
const ResultObject_type_1 = require("../core/types/ResultObject.type");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter
    .get('/me', tockenGuard_middleware_1.tokenGuard, whoAmI_handler_1.whoAmIHandler)
    //.post('/login',inputAuthValidation, checkValidationErrors, authHandler)
    .post('/login', inputAuthValidation_validation_1.inputAuthValidation, validationErrorResult_handler_1.checkValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authService_bll_1.authService.checkUserInfo(req.body);
    if (user.status === ResultObject_type_1.ResultStatuses.success) {
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
        return;
    }
    res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
}));
