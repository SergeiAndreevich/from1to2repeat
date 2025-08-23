import {Request,Response} from "express";

export async function resendConfirmationHandler(req:Request, res: Response) {
    const email =  req.body;
    //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)

    //ну и 400 если некорректная почта или уже подтверждена
}