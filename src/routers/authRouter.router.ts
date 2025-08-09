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

export const authRouter = Router({});

authRouter
    .get('/me', tokenGuard, whoAmIHandler)
    .post('/login',inputAuthValidation, checkValidationErrors, authHandler)
    // .post('/login', inputAuthValidation, checkValidationErrors, async(req:Request,res:Response)=>{
    //     const user = await authService.checkUserInfo(req.body);
    //     console.log(user);
    //     if(user.status ===  ResultStatuses.success){
    //         res.sendStatus(httpStatus.NoContent);
    //         return
    //     }
    //     res.sendStatus(httpStatus.Unauthorized)
    // })