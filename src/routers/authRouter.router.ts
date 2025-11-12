import {Router, Response, Request} from 'express';
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {inputAuthValidation} from "../core/validation/inputAuthValidation.validation";
import {inputRegistrationValidation} from "../core/validation/inputRegistrationValidation.validation";
import {registrationConfirmationValidation} from "../core/validation/registrationConfirmationValidation.validation";
import {emailValidation} from "../core/validation/emailValidation.validation";
import {antiClicker} from "../core/protection/antiClicker.middleware";
import {codeAndPasswordValidation} from "../core/validation/recoveryCodeAndPasswordValidation.validation";
import {container} from "../composition-root";
import {AuthController} from "../classes/auth";

export const authRouter = Router({});

const authController = container.get(AuthController);

authRouter
    .get('/me',antiClicker, tokenGuard, authController.whoAmIHandler.bind(authController)) //получаем инфо о себе
    .post('/login', antiClicker,inputAuthValidation, checkValidationErrors, authController.authHandler.bind(authController)) //залогинились и получили jwt-token и refreshToken
    .post('/registration-confirmation', antiClicker, registrationConfirmationValidation, checkValidationErrors, authController.registrationConfirmationHandler.bind(authController)) //подтвердили почту
    .post('/registration', antiClicker, inputRegistrationValidation, checkValidationErrors, authController.registrationHandler.bind(authController)) //зарегались и получили письмо с кодом подтверждения
    .post('/registration-email-resending', antiClicker, emailValidation, checkValidationErrors, authController.resendConfirmationHandler.bind(authController)) //переотправили письмо с кодом
    .post('/refresh-token', antiClicker, authController.refreshHandler.bind(authController)) //выдаем новый рефреш-токен по старому
    .post('/logout', antiClicker, authController.logoutHandler.bind(authController)) //протухаем рефреш токен и больше не выдаем новых
    .post('/password-recovery',antiClicker, emailValidation, checkValidationErrors, authController.passwordRecoveryHandler.bind(authController)) //ввел email, на него нужно отправить письмо с recovery-code
    .post('/new-password', antiClicker, codeAndPasswordValidation, checkValidationErrors, authController.setNewPasswordHandler.bind(authController) ) //отдаем recovery-code и новый пароль: код как допуск, стираем старый пароль, записываем новый

// В базе данных, кроме даты выдачи токена,
//     храним так же дату окончания действия токена, для того, чтобы можно было периодически зачищать девайсы (сессии) с "протухшиими" токенами;
// Auth: ограничения на кол-во попыток (обратите внимание на response-код 429). Для каждого защищенного эндпоинта попытки подсчитывем отдельно

//короче, теперь в /login мы создаем сессию с уникальным userId[MongoID] и deviceId [uuid(), бывший jti]
//и в refreshToken сидит deviceId

//при /refresh-token мы берем refreshToken из куки, раскукоживаем (userId, deviceId),
//протухаем сессию по deviceId и создаем новые accessToken, refreshToken
//создаем новую сессию, но в неё нужно перезаписать старые userId, ip, deviceName

//при /logout смотрим на refreshToken, если все ок - протухаем его и очищаем куки

