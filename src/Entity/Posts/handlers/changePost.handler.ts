import {Request, Response} from 'express';
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {postsService} from "../BLL/postsService.bll";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function changePostHandler(req:Request,res:Response) {
    await postsService.updatePost(req.params.id,req.body);
    res.sendStatus(httpStatus.NoContent)
}