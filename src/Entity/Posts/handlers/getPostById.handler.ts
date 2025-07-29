import {Request, Response} from "express";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getPostByIdHandler(req:Request,res:Response) {
    const post = await queryRepo.findPostByIdOrFail(req.params.id);
    if(!post) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    res.status(httpStatus.Ok).send(post)

}