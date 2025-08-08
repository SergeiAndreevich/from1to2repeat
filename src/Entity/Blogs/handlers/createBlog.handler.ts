import {Request,Response} from "express";
import {blogsService} from "../BLL/blogsService.bll";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function createBlogHandler(req:Request, res: Response) {
    const createdId = await blogsService.createBlog(req.body);
    if(!createdId){
        //доп проверка
        res.sendStatus(httpStatus.ExtraError);
        return
    }
    const newBlog = await queryRepo.findBlogByIdOrFail(createdId);
    //если все ок, то 201
    res.status(httpStatus.Created).send(newBlog)
}

//ошибка валидации 400
//в guard ошибка 401 неавторизован