import {Request,Response} from "express";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../types/httpStatuses.type";
type TypeMeViewModel = {
    "email": "string",
    "login": "string",
    "userId": "string"
}

export async function whoAmIHandler(req:Request, res:Response):Promise<void | TypeMeViewModel>{
    const userId = req.userId;
    if(userId === undefined || userId === null || userId.length === 0) {
        res.sendStatus(httpStatus.Unauthorized)
        return
    }
    const user = await queryRepo.findUserByIdOrFail(userId);
    if(!user){
        res.sendStatus(httpStatus.ExtraError)
        return
    }
    res.status(httpStatus.Ok).send({email:user?.email,login:user?.login,userId:user?.id})
}