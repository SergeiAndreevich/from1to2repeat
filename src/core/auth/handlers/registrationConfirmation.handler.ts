import {Request, Response} from "express";
import {usersService} from "../../../Entity/Users/BLL/usersService.bll";
import {httpStatus} from "../../types/httpStatuses.type";
import {ResultStatuses} from "../../types/ResultObject.type";

export async function registrationConfirmationHandler(req:Request, res:Response) {
    const code =  req.body;
    //204 если код подходит
    const result = await usersService.confirmUser(code);
    if(result.status === ResultStatuses.unauthorized) {
        res.sendStatus(httpStatus.BadRequest);
        return
    }
    if(result.status === ResultStatuses.notFound) {
        res.sendStatus(httpStatus.BadRequest);
        return
    }
    if(result.status === ResultStatuses.alreadyExist) {
        res.sendStatus(httpStatus.BadRequest);
        return
    }
    res.sendStatus(httpStatus.NoContent)
    //400 если код не подходит, истек или уже был применен
}