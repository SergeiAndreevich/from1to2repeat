import {Request, Response} from 'express';

export async function registrationHandler(req: Request, res: Response): Promise<void> {
    const data = req.body; //пришли login, email, password
    //204 - если входящие данные приняты. Код подтверждения вскоре будет выслан на указанную почту
    // код в ссылке как квери-параметр, например, ляляля?code=yourcode

    //ну и 400, еслу юзер уже есть (а также если некорректный инпут)
}