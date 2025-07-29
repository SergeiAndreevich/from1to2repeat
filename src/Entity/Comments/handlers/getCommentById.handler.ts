import {Request, Response} from 'express';
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getCommentByIdHandler(req:Request, res: Response) {
    const comment = await queryRepo.findCommentByIdOrFail(req.params.id);
    if(!comment) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    res.status(httpStatus.Ok).send(comment)
}