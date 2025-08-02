import {Request, Response} from 'express';
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {IResult, ResultStatuses} from "../../../core/types/ResultObject.type";
import {TypeUserViewModel} from "../User.types";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
export async function removeUserHandler(req:Request,res:Response) {
    const userId = req.params.id;
    const user:IResult<TypeUserViewModel|null> = await queryRepo.findUserByIdOrFail(userId);
    if(user.status === ResultStatuses.notFound){
        res.sendStatus(404);
        return
    }
    await repository.removeUser(user.data!.id);
    res.sendStatus(204)
}