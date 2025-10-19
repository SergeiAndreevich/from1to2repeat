import {Router, Response, Request} from 'express';
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {whoAmIHandler} from "../core/auth/handlers/whoAmI.handler";
import {inputAuthValidation} from "../core/validation/inputAuthValidation.validation";
import {authHandler} from "../core/auth/handlers/auth.handler";
import {queryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {authService} from "../core/auth/BLL/authService.bll";
import {ResultStatuses} from "../core/types/ResultObject.type";
import {httpStatus} from "../core/types/httpStatuses.type";
import {inputRegistrationValidation} from "../core/validation/inputRegistrationValidation.validation";
import {registrationHandler} from "../core/auth/handlers/registration.handler";
import {registrationConfirmationValidation} from "../core/validation/registrationConfirmationValidation.validation";
import {emailValidation} from "../core/validation/emailValidation.validation";
import {registrationConfirmationHandler} from "../core/auth/handlers/registrationConfirmation.handler";
import {resendConfirmationHandler} from "../core/auth/handlers/resendConfirmation.handler";
import {refreshHandler} from "../core/auth/handlers/refreshToken.handler";
import {logoutHandler} from "../core/auth/handlers/logout.handler";
import {antiClicker} from "../core/protection/antiClicker.middleware";

export const authRouter = Router({});

authRouter
    .get('/me',antiClicker, tokenGuard, whoAmIHandler) //получаем инфо о себе
    .post('/login', antiClicker,inputAuthValidation, checkValidationErrors, authHandler) //залогинились и получили jwt-token и refreshToken
    .post('/registration-confirmation', antiClicker, registrationConfirmationValidation, checkValidationErrors, registrationConfirmationHandler) //подтвердили почту
    .post('/registration', antiClicker, inputRegistrationValidation, checkValidationErrors, registrationHandler) //зарегались и получили письмо с кодом подтверждения
    .post('/registration-email-resending', antiClicker, emailValidation, checkValidationErrors, resendConfirmationHandler) //переотправили письмо с кодом
    .post('/refresh-token', antiClicker, refreshHandler) //выдаем новый рефреш-токен по старому
    .post('/logout', antiClicker, logoutHandler) //протухаем рефреш токен и больше не выдаем новых

// В базе данных, кроме даты выдачи токена,
//     храним так же дату окончания действия токена, для того, чтобы можно было периодически зачищать девайсы (сессии) с "протухшиими" токенами;
// Auth: ограничения на кол-во попыток (обратите внимание на response-код 429). Для каждого защищенного эндпоинта попытки подсчитывем отдельно

//короче, теперь в /login мы создаем сессию с уникальным userId[MongoID] и deviceId [uuid(), бывший jti]
//и в refreshToken сидит deviceId

//при /refresh-token мы берем refreshToken из куки, раскукоживаем (userId, deviceId),
//протухаем сессию по deviceId и создаем новые accessToken, refreshToken
//создаем новую сессию, но в неё нужно перезаписать старые userId, ip, deviceName

//при /logout смотрим на refreshToken, если все ок - протухаем его и очищаем куки