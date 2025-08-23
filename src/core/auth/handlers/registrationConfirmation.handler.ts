import {Request,Response} from "express";

export async function registrationConfirmationHandler(req:Request, res:Response) {
    const code =  req.body;
    //204 если код подходит

    //400 если код не подходит, истек или уже был применен
}