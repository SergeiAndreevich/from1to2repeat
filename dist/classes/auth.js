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
exports.AuthController = void 0;
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const inversify_1 = require("inversify");
const authService_bll_1 = require("../core/auth/BLL/authService.bll");
const ResultObject_type_1 = require("../core/types/ResultObject.type");
const createErrorsMessage_function_1 = require("../core/errors/createErrorsMessage.function");
const usersService_bll_1 = require("../Entity/Users/BLL/usersService.bll");
let AuthController = class AuthController {
    constructor(queryRepo, authService, usersService) {
        this.queryRepo = queryRepo;
        this.authService = authService;
        this.usersService = usersService;
    }
    async whoAmIHandler(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send({ email: user?.email, login: user?.login, userId: user?.id });
    }
    async authHandler(req, res) {
        const ip = req.ip;
        if (!ip) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Forbidden);
            return;
        }
        const deviceName = req.headers['user-agent'] || 'Unknown device';
        //проверяем, есть ли такой юзер. Если есть и все данные сходятся - выдаем токены
        const result = await this.authService.checkUserInfo(req.body, { ip, deviceName });
        switch (result.status) {
            case ResultObject_type_1.ResultStatuses.notFound:
                res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
                break;
            case ResultObject_type_1.ResultStatuses.unauthorized:
                res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
                break;
            case ResultObject_type_1.ResultStatuses.success:
                res.cookie("refreshToken", result.data.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 20 * 1000 // 20 secund в ms
                });
                res.status(httpStatuses_type_1.httpStatus.Ok).send({ accessToken: result.data.accessToken });
                break;
            default:
                res.sendStatus(httpStatuses_type_1.httpStatus.InternalServerError);
                break;
        }
    }
    async registrationConfirmationHandler(req, res) {
        const { code } = req.body; // ✅ достаём строку
        //console.log('🔍 Confirmation attempt with code:', code, typeof code);
        //204 если код подходит
        const result = await this.usersService.confirmUser(code);
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
    }
    async registrationHandler(req, res) {
        const userInput = req.body;
        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = await this.usersService.createUser(userInput);
        //результат работы по созданию юзера
        if (newUserResult.status === ResultObject_type_1.ResultStatuses.alreadyExist) {
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send((0, createErrorsMessage_function_1.createErrorsMessages)(newUserResult.errorMessage));
            return;
        }
        const user = await this.queryRepo.findUserByIdOrFail(newUserResult.data.id);
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async resendConfirmationHandler(req, res) {
        const { email } = req.body; // достаём строку email
        const userEmail = await this.queryRepo.checkEmailConfirmation(email);
        if (!userEmail) {
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send({
                errorsMessages: [
                    {
                        "message": "bad request",
                        "field": "email"
                    }
                ]
            });
            return;
        }
        const result = await this.usersService.updateConfirmationCode(email);
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
        //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)
        //ну и 400 если некорректная почта или уже подтверждена
    }
    async refreshHandler(req, res) {
        //проверяем,пришел ли в куки рефреш-токен
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        // ВАЖНО: Сначала проверяем валидность токена
        //ищем, обновляем пару
        const result = await this.authService.updateRefreshToken(refreshToken);
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        //отправляем пользователю
        res.cookie("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: true,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 20 * 1000 // 20 secund в ms
        });
        res.status(httpStatuses_type_1.httpStatus.Ok).send({ accessToken: result.data.accessToken });
    }
    async logoutHandler(req, res) {
        // check actual token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        // вносим изменения в БД, т.е. протухаем существующий токен
        const result = await this.authService.removeRefreshToken(refreshToken);
        //проверяем статус того че пришло из БД
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        //очищаем куки и возвращаем ответочку
        res.clearCookie("refreshToken");
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async passwordRecoveryHandler(req, res) {
        //получаем email
        const email = req.body.email;
        //отдаем его в сервис и говорим "отправь код восстановления пароля"
        await this.authService.recoveryPassword(email);
        //успешно? отправляем 204
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async setNewPasswordHandler(req, res) {
        //забираем данные из боди
        const input = req.body;
        //отдаем в сервис и говорим "обнови"
        const result = await this.authService.setNewPassword(input.recoveryCode, input.newPassword);
        //получаем результат
        if (result.status !== ResultObject_type_1.ResultStatuses.success) {
            res.status(httpStatuses_type_1.httpStatus.BadRequest).send((0, createErrorsMessage_function_1.createErrorsMessages)(result.errorMessage));
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(authService_bll_1.AuthService)),
    __param(2, (0, inversify_1.inject)(usersService_bll_1.UsersService)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        authService_bll_1.AuthService,
        usersService_bll_1.UsersService])
], AuthController);
