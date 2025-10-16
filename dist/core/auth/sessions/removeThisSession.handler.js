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
exports.removeThisSessionHandler = removeThisSessionHandler;
const sessionsService_bll_1 = require("../BLL/sessionsService.bll");
const httpStatuses_type_1 = require("../../types/httpStatuses.type");
const ResultObject_type_1 = require("../../types/ResultObject.type");
const queryRepo_repository_1 = require("../../dataAcsessLayer/queryRepo.repository");
function removeThisSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const deviceId = req.params.deviceId;
        const session = yield queryRepo_repository_1.queryRepo.findSessionByDevice(deviceId);
        if (!session) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const result = yield sessionsService_bll_1.sessionsService.removeThisSession(session, refreshToken);
        switch (result.status) {
            case ResultObject_type_1.ResultStatuses.forbidden:
                res.sendStatus(httpStatuses_type_1.httpStatus.Forbidden);
                return;
            case ResultObject_type_1.ResultStatuses.unauthorized:
                res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
                return;
            case ResultObject_type_1.ResultStatuses.success:
                res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
                return;
            case ResultObject_type_1.ResultStatuses.notFound:
                res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
                return;
            default:
                res.sendStatus(httpStatuses_type_1.httpStatus.InternalServerError);
                return;
        }
    });
}
