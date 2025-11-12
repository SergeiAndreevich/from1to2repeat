"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityController = void 0;
const inversify_1 = require("inversify");
const sessionsRepository_repository_1 = require("../core/dataAcsessLayer/repository/sessionsRepository.repository");
const sessionsService_bll_1 = require("../core/auth/BLL/sessionsService.bll");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
const jwt_helper_1 = require("../core/helpers/jwt.helper");
const ResultObject_type_1 = require("../core/types/ResultObject.type");
let SecurityController = class SecurityController {
    constructor(sessionsRepo, sessionsService, queryRepo) {
        this.sessionsRepo = sessionsRepo;
        this.sessionsService = sessionsService;
        this.queryRepo = queryRepo;
    }
    async getAllDevicesHandler(req, res) {
        //условие гуарда здесь валидный рефреш токен. И только!
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const sessions = await this.sessionsRepo.findSessionsByUserId(decodedRefresh.userId);
        if (sessions.length < 1) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send(sessions);
    }
    async removeOtherSessionsHandler(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const result = await this.sessionsService.removeOtherSessions(refreshToken);
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async removeThisSessionHandler(req, res) {
        const deviceId = req.params.deviceId;
        const session = await this.queryRepo.findSession(deviceId);
        if (!session) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const result = await this.sessionsService.removeThisSession(session, refreshToken);
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
    }
};
exports.SecurityController = SecurityController;
exports.SecurityController = SecurityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(sessionsRepository_repository_1.SessionsRepo)),
    __param(1, (0, inversify_1.inject)(sessionsService_bll_1.SessionsService)),
    __param(2, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __metadata("design:paramtypes", [sessionsRepository_repository_1.SessionsRepo,
        sessionsService_bll_1.SessionsService,
        queryRepo_repository_1.QueryRepo])
], SecurityController);
