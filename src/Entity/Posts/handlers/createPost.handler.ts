import {Request, Response} from 'express';
import {postsService} from "../BLL/postsService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function createPostHandler(req:Request, res:Response) {
    const createdId = await postsService.createPost(req.body);
    //доп проверка
    if(!createdId){
        res.sendStatus(httpStatus.ExtraError);
        return
    }
    const createdPost = await queryRepo.findPostByIdOrFail(createdId);
    if(!createdPost){
        res.sendStatus(httpStatus.ExtraError);
        return
    }
    //по документации тут должен быть только 201 и ничего другого, но я сделал отсебятины
    res.status(httpStatus.Created).send(createdPost)
}

//400 в валидации
//401 в авторизации