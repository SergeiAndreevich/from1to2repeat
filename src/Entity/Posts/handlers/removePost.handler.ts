import {Request, Response} from "express";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {postsService} from "../BLL/postsService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function removePostHandler(req:Request,res:Response) {
    const postId = req.params.id;
    const post = await queryRepo.findPostByIdOrFail(postId);
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await postsService.removePost(postId);
    res.sendStatus(httpStatus.NoContent)
}