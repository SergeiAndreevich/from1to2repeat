import {Request, Response} from 'express';
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {postsService} from "../BLL/postsService.bll";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function changePostHandler(req:Request,res:Response) {
    const postId = req.params.id;
    const post = await queryRepo.findPostByIdOrFail(postId);
    //отработали 404
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await postsService.updatePost(postId,req.body);
    res.sendStatus(httpStatus.NoContent)
}

//здесб задействованы 204,400, 401 и 404
//400 отрабатывает в валидаторе
//401 в авторизации