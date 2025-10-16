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
exports.removeOtherSessionsHandler = removeOtherSessionsHandler;
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const sessionsService_bll_1 = require("../BLL/sessionsService.bll");
const ResultObject_type_1 = require("../../types/ResultObject.type");
function removeOtherSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const result = yield sessionsService_bll_1.sessionsService.removeOtherSessions(refreshToken);
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    });
}
