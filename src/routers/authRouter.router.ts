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

export const authRouter = Router({});

authRouter
    .get('/me', tokenGuard, whoAmIHandler)
    .post('/login',inputAuthValidation, checkValidationErrors, authHandler)
    .post('/registration-confirmation', registrationConfirmationValidation, checkValidationErrors, registrationConfirmationHandler)
    .post('/registration', inputRegistrationValidation, checkValidationErrors, registrationHandler)
    .post('/registration-email-resending', emailValidation, checkValidationErrors, resendConfirmationHandler)
    // .post('/login', inputAuthValidation, checkValidationErrors, async(req:Request,res:Response)=>{
    //     const user = await authService.checkUserInfo(req.body);
    //     console.log(user);
    //     if(user.status ===  ResultStatuses.success){
    //         res.sendStatus(httpStatus.NoContent);
    //         return
    //     }
    //     res.sendStatus(httpStatus.Unauthorized)
    // })