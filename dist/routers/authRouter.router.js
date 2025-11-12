"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const inputAuthValidation_validation_1 = require("../core/validation/inputAuthValidation.validation");
const inputRegistrationValidation_validation_1 = require("../core/validation/inputRegistrationValidation.validation");
const registrationConfirmationValidation_validation_1 = require("../core/validation/registrationConfirmationValidation.validation");
const emailValidation_validation_1 = require("../core/validation/emailValidation.validation");
const antiClicker_middleware_1 = require("../core/protection/antiClicker.middleware");
const recoveryCodeAndPasswordValidation_validation_1 = require("../core/validation/recoveryCodeAndPasswordValidation.validation");
const composition_root_1 = require("../composition-root");
const auth_1 = require("../classes/auth");
exports.authRouter = (0, express_1.Router)({});
const authController = composition_root_1.container.get(auth_1.AuthController);
exports.authRouter
    .get('/me', antiClicker_middleware_1.antiClicker, tockenGuard_middleware_1.tokenGuard, authController.whoAmIHandler.bind(authController)) //получаем инфо о себе
    .post('/login', antiClicker_middleware_1.antiClicker, inputAuthValidation_validation_1.inputAuthValidation, validationErrorResult_handler_1.checkValidationErrors, authController.authHandler.bind(authController)) //залогинились и получили jwt-token и refreshToken
    .post('/registration-confirmation', antiClicker_middleware_1.antiClicker, registrationConfirmationValidation_validation_1.registrationConfirmationValidation, validationErrorResult_handler_1.checkValidationErrors, authController.registrationConfirmationHandler.bind(authController)) //подтвердили почту
    .post('/registration', antiClicker_middleware_1.antiClicker, inputRegistrationValidation_validation_1.inputRegistrationValidation, validationErrorResult_handler_1.checkValidationErrors, authController.registrationHandler.bind(authController)) //зарегались и получили письмо с кодом подтверждения
    .post('/registration-email-resending', antiClicker_middleware_1.antiClicker, emailValidation_validation_1.emailValidation, validationErrorResult_handler_1.checkValidationErrors, authController.resendConfirmationHandler.bind(authController)) //переотправили письмо с кодом
    .post('/refresh-token', antiClicker_middleware_1.antiClicker, authController.refreshHandler.bind(authController)) //выдаем новый рефреш-токен по старому
    .post('/logout', antiClicker_middleware_1.antiClicker, authController.logoutHandler.bind(authController)) //протухаем рефреш токен и больше не выдаем новых
    .post('/password-recovery', antiClicker_middleware_1.antiClicker, emailValidation_validation_1.emailValidation, validationErrorResult_handler_1.checkValidationErrors, authController.passwordRecoveryHandler.bind(authController)) //ввел email, на него нужно отправить письмо с recovery-code
    .post('/new-password', antiClicker_middleware_1.antiClicker, recoveryCodeAndPasswordValidation_validation_1.codeAndPasswordValidation, validationErrorResult_handler_1.checkValidationErrors, authController.setNewPasswordHandler.bind(authController)); //отдаем recovery-code и новый пароль: код как допуск, стираем старый пароль, записываем новый
// В базе данных, кроме даты выдачи токена,
//     храним так же дату окончания действия токена, для того, чтобы можно было периодически зачищать девайсы (сессии) с "протухшиими" токенами;
// Auth: ограничения на кол-во попыток (обратите внимание на response-код 429). Для каждого защищенного эндпоинта попытки подсчитывем отдельно
//короче, теперь в /login мы создаем сессию с уникальным userId[MongoID] и deviceId [uuid(), бывший jti]
//и в refreshToken сидит deviceId
//при /refresh-token мы берем refreshToken из куки, раскукоживаем (userId, deviceId),
//протухаем сессию по deviceId и создаем новые accessToken, refreshToken
//создаем новую сессию, но в неё нужно перезаписать старые userId, ip, deviceName
//при /logout смотрим на refreshToken, если все ок - протухаем его и очищаем куки
