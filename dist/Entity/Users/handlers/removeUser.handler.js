"use strict";
// import {Request, Response} from 'express';
// import {IResult, ResultStatuses} from "../../../core/types/ResultObject.type";
// import {TypeUserViewModel} from "../User.types";
// import {repository} from "../../../core/dataAcsessLayer/repository.repository";
// import * as http from "node:http";
// import {httpStatus} from "../../../core/types/httpStatuses.type";
// import {usersRepository} from "../../../core/dataAcsessLayer/repository/usersRepository.repository";
// export async function removeUserHandler(req:Request,res:Response) {
//     const userId = req.params.id;
//     const user:TypeUserViewModel|null = await queryRepo.findUserByIdOrFail(userId);
//     //отработали 404
//     if(!user){
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     await usersRepository.removeUser(user.id);
//     res.sendStatus(httpStatus.NoContent)
// }
//должны отработать 204, 401 и 404
//в авторизации отработали 401
