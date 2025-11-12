"use strict";
// import {Request, Response} from 'express';
// import {usersService} from "../../../Entity/Users/BLL/usersService.bll";
// import {TypeUserInputModel} from "../../../Entity/Users/User.types";
// import {ResultStatuses} from "../../types/ResultObject.type";
// import {httpStatus} from "../../types/httpStatuses.type";
// import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
// import {createErrorsMessages} from "../../errors/createErrorsMessage.function";
// export async function registrationHandler(req: Request, res: Response): Promise<void> {
//     //пришли login, email, password
//     //204 - если входящие данные приняты. Код подтверждения вскоре будет выслан на указанную почту
//     // код в ссылке как квери-параметр, например, ляляля?code=yourcode
//     //ну и 400, еслу юзер уже есть (а также если некорректный инпут)
//
//     //console.log('=== REGISTRATION DEBUG ===');
//     //console.log('1. NODE_ENV:', process.env.NODE_ENV);
//
//     const userInput:TypeUserInputModel = req.body;
//     //console.log('2. User input:', userInput);
//
//     //передаем их в БЛЛ и просим создать юзера, результатом создания является id
//     const newUserResult = await usersService.createUser(userInput);
//     //console.log('3. Service result status:', newUserResult);
//
//     //результат работы по созданию юзера
//     if(newUserResult.status === ResultStatuses.alreadyExist){
//         res.status(httpStatus.BadRequest).send(createErrorsMessages(newUserResult.errorMessage!));
//         return
//     }
//     const user = await queryRepo.findUserByIdOrFail(newUserResult.data!.id);
//     //console.log('4. User found:', user);
//     if(!user){
//         res.sendStatus(httpStatus.ExtraError);
//         return
//     }
//
//     //console.log('5. 🔒 Sending response WITHOUT code for production');
//         res.sendStatus(httpStatus.NoContent);
//
//     //res.sendStatus(204)
//     // ⭐ В ТЕСТОВОЙ СРЕДЕ ВОЗВРАЩАЕМ КОД ⭐
//     //if (process.env.NODE_ENV === 'test') {
//     //     res.status(httpStatus.NoContent).send({
//     //         message: 'confirmation code is sent to your email',
//     //         confirmationCode: newUserResult.data!.code // ← добавляем код для теста
//     //      });
//     // } else {
//     //     res.status(httpStatus.NoContent).send({
//     //         message: 'confirmation code is sent to your email'
//     //     });
//     // }
//     //res.status(httpStatus.NoContent).send({message: 'confirmation code is sent to your email'})
// }
