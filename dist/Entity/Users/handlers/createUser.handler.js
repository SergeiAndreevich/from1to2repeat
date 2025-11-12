"use strict";
// import {Request, Response} from 'express';
// import {TypeUserInputModel} from "../User.types";
// import {usersService} from "../BLL/usersService.bll";
// import {ResultStatuses} from "../../../core/types/ResultObject.type";
// import {httpStatus} from "../../../core/types/httpStatuses.type";
// import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
//
// export async function createUserHandler(req:Request, res: Response) {
//     //получили данные из req body
//     const userInput:TypeUserInputModel = req.body;
//
//     //передаем их в БЛЛ и просим создать юзера, результатом создания является id
//     const newUserResult = await usersService.createUserBySuperAdmin(userInput);
//
//     //результат работы по созданию юзера
//     if(newUserResult.status === ResultStatuses.alreadyExist){
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//     const user = await queryRepo.findUserByIdOrFail(newUserResult.data!);
//     if(!user){
//         res.sendStatus(httpStatus.ExtraError);
//         return
//     }
//     res.status(httpStatus.Created).send(user)
// }
//
// //201, 400 и 401
//401 отработала в авторизации, но еще и здесь проверяет на уникальность логин и email
