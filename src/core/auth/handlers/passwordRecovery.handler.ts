import {Request, Response} from 'express';
import {authService} from "../BLL/authService.bll";
import {httpStatus} from "../../types/httpStatuses.type";


export async function passwordRecoveryHandler(req: Request, res: Response): Promise<void> {
    //получаем email
    const email = req.body.email;
    //отдаем его в сервис и говорим "отправь код восстановления пароля"
    const result = await authService.recoveryPassword(email);
    //успешно? отправляем 204
    res.sendStatus(httpStatus.NoContent)
}