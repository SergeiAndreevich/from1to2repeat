"use strict";
// import {Request, Response} from "express";
// import {usersService} from "../../../Entity/Users/BLL/usersService.bll";
// import {httpStatus} from "../../types/httpStatuses.type";
// import {ResultStatuses} from "../../types/ResultObject.type";
// import {createErrorsMessages} from "../../errors/createErrorsMessage.function";
//
// export async function registrationConfirmationHandler(req:Request, res:Response) {
//     const { code } = req.body; // ✅ достаём строку
//     //console.log('🔍 Confirmation attempt with code:', code, typeof code);
//
//     //204 если код подходит
//     const result = await usersService.confirmUser(code);
//     //console.log('🔍 Confirmation result:', result.status);
//
//     if(result.status === ResultStatuses.unauthorized) {
//         //console.log('❌ Code expired');
//         res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
//         return
//     }
//     if(result.status === ResultStatuses.notFound) {
//         //console.log('❌ Code not found');
//         res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
//         return
//     }
//     if(result.status === ResultStatuses.alreadyExist) {
//         //console.log('❌ Already confirmed');
//         res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
//         return
//     }
//     //console.log('✅ Email confirmed successfully');
//     res.sendStatus(httpStatus.NoContent)
//     //400 если код не подходит, истек или уже был применен
// }
