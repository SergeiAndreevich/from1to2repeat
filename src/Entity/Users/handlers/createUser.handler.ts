import {Request, Response} from 'express';
import {TypeUserInputModel} from "../User.types";
import {usersService} from "../BLL/usersService.bll";
import {ResultStatuses} from "../../../core/types/ResultObject.type";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function createUserHandler(req:Request, res: Response) {
    //получили данные из req body
    const userInput:TypeUserInputModel = req.body;

    //передаем их в БЛЛ и просим создать юзера, результатом создания является id
    const newUserResult = await usersService.createUser(userInput);

    //результат работы по созданию юзера
    if(newUserResult.status !== ResultStatuses.success){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    res.status(httpStatus.Created).send(newUserResult.data)
}