import {Request, Response} from 'express';
import {postsService} from "../BLL/postsService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function createPostHandler(req:Request, res:Response) {
    const createdId = await postsService.createPost(req.body);
    const createdPost = await queryRepo.findPostByIdOrFail(createdId);
    if(!createdPost){
        res.sendStatus(httpStatus.ExtraError);
        return
    }
    res.status(httpStatus.Created).send(createdPost)
}