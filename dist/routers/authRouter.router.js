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
const antiClicker_middleware_1 = require("../core/protection/antiClicker.middleware");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter
    .get('/me', antiClicker_middleware_1.antiClicker, tockenGuard_middleware_1.tokenGuard, whoAmI_handler_1.whoAmIHandler) //получаем инфо о себе
    .post('/login', antiClicker_middleware_1.antiClicker, inputAuthValidation_validation_1.inputAuthValidation, validationErrorResult_handler_1.checkValidationErrors, auth_handler_1.authHandler) //залогинились и получили jwt-token и refreshToken
    .post('/registration-confirmation', antiClicker_middleware_1.antiClicker, registrationConfirmationValidation_validation_1.registrationConfirmationValidation, validationErrorResult_handler_1.checkValidationErrors, registrationConfirmation_handler_1.registrationConfirmationHandler) //подтвердили почту
    .post('/registration', antiClicker_middleware_1.antiClicker, inputRegistrationValidation_validation_1.inputRegistrationValidation, validationErrorResult_handler_1.checkValidationErrors, registration_handler_1.registrationHandler) //зарегались и получили письмо с кодом подтверждения
    .post('/registration-email-resending', antiClicker_middleware_1.antiClicker, emailValidation_validation_1.emailValidation, validationErrorResult_handler_1.checkValidationErrors, resendConfirmation_handler_1.resendConfirmationHandler) //переотправили письмо с кодом
    .post('/refresh-token', antiClicker_middleware_1.antiClicker, refreshToken_handler_1.refreshHandler) //выдаем новый рефреш-токен по старому
    .post('/logout', antiClicker_middleware_1.antiClicker, logout_handler_1.logoutHandler); //протухаем рефреш токен и больше не выдаем новых
// В базе данных, кроме даты выдачи токена,
//     храним так же дату окончания действия токена, для того, чтобы можно было периодически зачищать девайсы (сессии) с "протухшиими" токенами;
// Auth: ограничения на кол-во попыток (обратите внимание на response-код 429). Для каждого защищенного эндпоинта попытки подсчитывем отдельно
//короче, теперь в /login мы создаем сессию с уникальным userId[MongoID] и deviceId [uuid(), бывший jti]
//и в refreshToken сидит deviceId
//при /refresh-token мы берем refreshToken из куки, раскукоживаем (userId, deviceId),
//протухаем сессию по deviceId и создаем новые accessToken, refreshToken
//создаем новую сессию, но в неё нужно перезаписать старые userId, ip, deviceName
//при /logout смотрим на refreshToken, если все ок - протухаем его и очищаем куки
