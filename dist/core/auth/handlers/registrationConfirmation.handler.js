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
exports.registrationConfirmationHandler = registrationConfirmationHandler;
const usersService_bll_1 = require("../../../Entity/Users/BLL/usersService.bll");
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const createErrorsMessage_function_1 = require("../../errors/createErrorsMessage.function");
function registrationConfirmationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = req.body; // ✅ достаём строку
        //console.log('🔍 Confirmation attempt with code:', code, typeof code);
        //204 если код подходит
        const result = yield usersService_bll_1.usersService.confirmUser(code);
        //console.log('🔍 Confirmation result:', result.status);
        if (result.status === ResultObject_type_1.ResultStatuses.unauthorized) {
            //console.log('❌ Code expired');
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send((0, createErrorsMessage_function_1.createErrorsMessages)(result.errorMessage));
            return;
        }
        if (result.status === ResultObject_type_1.ResultStatuses.notFound) {
            //console.log('❌ Code not found');
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send((0, createErrorsMessage_function_1.createErrorsMessages)(result.errorMessage));
            return;
        }
        if (result.status === ResultObject_type_1.ResultStatuses.alreadyExist) {
            //console.log('❌ Already confirmed');
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send((0, createErrorsMessage_function_1.createErrorsMessages)(result.errorMessage));
            return;
        }
        //console.log('✅ Email confirmed successfully');
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
        //400 если код не подходит, истек или уже был применен
    });
}
