import {Router} from 'express';
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {whoAmIHandler} from "../core/auth/handlers/whoAmI.handler";
import {inputAuthValidation} from "../core/validation/inputAuthValidation.validation";
import {authHandler} from "../core/auth/handlers/auth.handler";

export const authRouter = Router({});

authRouter
    .get('/me', tokenGuard, whoAmIHandler)
    .post('/login',inputAuthValidation, checkValidationErrors, authHandler)