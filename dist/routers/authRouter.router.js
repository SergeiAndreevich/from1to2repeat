"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const whoAmI_handler_1 = require("../core/auth/handlers/whoAmI.handler");
const inputAuthValidation_validation_1 = require("../core/validation/inputAuthValidation.validation");
const auth_handler_1 = require("../core/auth/handlers/auth.handler");
const inputRegistrationValidation_validation_1 = require("../core/validation/inputRegistrationValidation.validation");
const registration_handler_1 = require("../core/auth/handlers/registration.handler");
const registrationConfirmationValidation_validation_1 = require("../core/validation/registrationConfirmationValidation.validation");
const emailValidation_validation_1 = require("../core/validation/emailValidation.validation");
const registrationConfirmation_handler_1 = require("../core/auth/handlers/registrationConfirmation.handler");
const resendConfirmation_handler_1 = require("../core/auth/handlers/resendConfirmation.handler");
const refreshToken_handler_1 = require("../core/auth/handlers/refreshToken.handler");
const logout_handler_1 = require("../core/auth/handlers/logout.handler");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter
    .get('/me', tockenGuard_middleware_1.tokenGuard, whoAmI_handler_1.whoAmIHandler) //получаем инфо о себе
    .post('/login', inputAuthValidation_validation_1.inputAuthValidation, validationErrorResult_handler_1.checkValidationErrors, auth_handler_1.authHandler) //залогинились и получили jwt-token и refreshToken
    .post('/registration-confirmation', registrationConfirmationValidation_validation_1.registrationConfirmationValidation, validationErrorResult_handler_1.checkValidationErrors, registrationConfirmation_handler_1.registrationConfirmationHandler) //подтвердили почту
    .post('/registration', inputRegistrationValidation_validation_1.inputRegistrationValidation, validationErrorResult_handler_1.checkValidationErrors, registration_handler_1.registrationHandler) //зарегались и получили письмо с кодом подтверждения
    .post('/registration-email-resending', emailValidation_validation_1.emailValidation, validationErrorResult_handler_1.checkValidationErrors, resendConfirmation_handler_1.resendConfirmationHandler) //переотправили письмо с кодом
    .post('/refresh-token', refreshToken_handler_1.refreshHandler) //выдаем новый рефреш-токен по старому
    .post('/logout', logout_handler_1.logoutHandler); //протухаем рефреш токен и больше не выдаем новых
// Нужно разрешить доступ к маршруту /auth/refresh-token без JWT-проверки.
// Туда человек приходит как раз тогда, когда у него access-токен просрочен, чтобы обновить его через refresh-токен.
// У меня сначала стоял там токен-гуард, вероятно из-за этого шли прахом все тесты
// .post('/login', inputAuthValidation, checkValidationErrors, async(req:Request,res:Response)=>{
//     const user = await authService.checkUserInfo(req.body);
//     console.log(user);
//     if(user.status ===  ResultStatuses.success){
//         res.sendStatus(httpStatus.NoContent);
//         return
//     }
//     res.sendStatus(httpStatus.Unauthorized)
// })
