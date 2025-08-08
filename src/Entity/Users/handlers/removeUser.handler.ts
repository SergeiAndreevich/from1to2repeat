import {Request, Response} from 'express';
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {IResult, ResultStatuses} from "../../../core/types/ResultObject.type";
import {TypeUserViewModel} from "../User.types";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import * as http from "node:http";
import {httpStatus} from "../../../core/types/httpStatuses.type";
export async function removeUserHandler(req:Request,res:Response) {
    const userId = req.params.id;
    const user:TypeUserViewModel|null = await queryRepo.findUserByIdOrFail(userId);
    //отработали 404
    if(!user){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await repository.removeUser(user.id);
    res.sendStatus(httpStatus.NoContent)
}

//должны отработать 204, 401 и 404
//в авторизации отработали 401