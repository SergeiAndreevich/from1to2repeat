import {Request,Response} from "express";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../types/httpStatuses.type";

export async function resendConfirmationHandler(req:Request, res: Response) {
    const email = await queryRepo.checkEmailConfirmation(req.body);
    if(!email) {
        res.status(httpStatus.BadRequest).send({
            errorsMessages: [
                {
                    "message": "bad request",
                    "field": "email"
                }
            ]
        });
        return
    }
    res.status(httpStatus.NoContent).send({message: 'Confirmation code is re-sent'})
    //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)
    //ну и 400 если некорректная почта или уже подтверждена
}
