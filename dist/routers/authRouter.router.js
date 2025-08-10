"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const whoAmI_handler_1 = require("../core/auth/handlers/whoAmI.handler");
const inputAuthValidation_validation_1 = require("../core/validation/inputAuthValidation.validation");
const auth_handler_1 = require("../core/auth/handlers/auth.handler");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter
    .get('/me', tockenGuard_middleware_1.tokenGuard, whoAmI_handler_1.whoAmIHandler)
    .post('/login', inputAuthValidation_validation_1.inputAuthValidation, validationErrorResult_handler_1.checkValidationErrors, auth_handler_1.authHandler);
// .post('/login', inputAuthValidation, checkValidationErrors, async(req:Request,res:Response)=>{
//     const user = await authService.checkUserInfo(req.body);
//     console.log(user);
//     if(user.status ===  ResultStatuses.success){
//         res.sendStatus(httpStatus.NoContent);
//         return
//     }
//     res.sendStatus(httpStatus.Unauthorized)
// })
