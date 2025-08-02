import {Request, Response} from 'express';
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {postsService} from "../BLL/postsService.bll";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function changePostHandler(req:Request,res:Response) {
    const postId = req.params.id;
    const post = await queryRepo.findPostByIdOrFail(postId);
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await postsService.updatePost(postId,req.body);
    res.sendStatus(httpStatus.NoContent)
}