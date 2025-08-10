import {Request,Response} from "express";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../types/httpStatuses.type";

export async function whoAmIHandler(req:Request, res:Response){
    const userId = req.userId;
    if(userId === undefined || userId === null || userId.length === 0) {
        res.sendStatus(httpStatus.Unauthorized)
        return
    }
    const user = await queryRepo.findUserByIdOrFail(userId);
    if(!user){
        res.sendStatus(httpStatus.ExtraError)
    }
    res.status(httpStatus.Ok).send(user)
}