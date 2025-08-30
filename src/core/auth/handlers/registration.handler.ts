import {Request, Response} from 'express';
import {usersService} from "../../../Entity/Users/BLL/usersService.bll";
import {TypeUserInputModel} from "../../../Entity/Users/User.types";
import {ResultStatuses} from "../../types/ResultObject.type";
import {httpStatus} from "../../types/httpStatuses.type";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";

export async function registrationHandler(req: Request, res: Response): Promise<void> {
    //пришли login, email, password
    //204 - если входящие данные приняты. Код подтверждения вскоре будет выслан на указанную почту
    // код в ссылке как квери-параметр, например, ляляля?code=yourcode
    //ну и 400, еслу юзер уже есть (а также если некорректный инпут)


    const userInput:TypeUserInputModel = req.body;

    //передаем их в БЛЛ и просим создать юзера, результатом создания является id
    const newUserResult = await usersService.createUser(userInput);

    //результат работы по созданию юзера
    if(newUserResult.status === ResultStatuses.alreadyExist){
        res.sendStatus(httpStatus.Unauthorized);
        return

    }

    const user = await queryRepo.findUserByIdOrFail(newUserResult.data!);
    if(!user){
        res.sendStatus(httpStatus.ExtraError);
        return
    }
    res.status(httpStatus.NoContent).send({message: 'confirmation code is sent to your email'})
}