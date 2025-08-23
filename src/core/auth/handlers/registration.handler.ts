import {Request, Response} from 'express';
import {usersService} from "../../../Entity/Users/BLL/usersService.bll";

export async function registrationHandler(req: Request, res: Response): Promise<void> {
    const data = req.body; //пришли login, email, password
    //204 - если входящие данные приняты. Код подтверждения вскоре будет выслан на указанную почту
    // код в ссылке как квери-параметр, например, ляляля?code=yourcode
    const result = await usersService.createUser(data);
    //ну и 400, еслу юзер уже есть (а также если некорректный инпут)
}