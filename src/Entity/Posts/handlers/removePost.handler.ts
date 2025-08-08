import {Request, Response} from "express";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {postsService} from "../BLL/postsService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function removePostHandler(req:Request,res:Response) {
    const postId = req.params.id;
    const post = await queryRepo.findPostByIdOrFail(postId);
    //здесь 404
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await postsService.removePost(postId);
    res.sendStatus(httpStatus.NoContent)
}

//работают 204, 404 и 401 коды
//401 в авторизации