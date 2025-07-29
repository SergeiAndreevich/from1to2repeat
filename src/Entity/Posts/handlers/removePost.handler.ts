import {Request, Response} from "express";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {postsService} from "../BLL/postsService.bll";

export async function removePostHandler(req:Request,res:Response) {
    await postsService.removePost(req.params.id);
    res.sendStatus(httpStatus.NoContent)
}