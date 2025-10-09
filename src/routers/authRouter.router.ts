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

export const authRouter = Router({});

authRouter
    .get('/me', tokenGuard, whoAmIHandler) //получаем инфо о себе
    .post('/login',inputAuthValidation, checkValidationErrors, authHandler) //залогинились и получили jwt-token и refreshToken
    .post('/registration-confirmation', registrationConfirmationValidation, checkValidationErrors, registrationConfirmationHandler) //подтвердили почту
    .post('/registration', inputRegistrationValidation, checkValidationErrors, registrationHandler) //зарегались и получили письмо с кодом подтверждения
    .post('/registration-email-resending', emailValidation, checkValidationErrors, resendConfirmationHandler) //переотправили письмо с кодом
    .post('/refresh-token', refreshHandler) //выдаем новый рефреш-токен по старому
    .post('/logout', logoutHandler) //протухаем рефреш токен и больше не выдаем новых

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