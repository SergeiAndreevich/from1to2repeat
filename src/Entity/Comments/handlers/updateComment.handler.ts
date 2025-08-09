import {Request, Response} from "express";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {commentsCollection} from "../../../core/db/mongoDB.db";
import {commentService} from "../BLL/commentService.bll";

export async function updateCommentHandler(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const comment = await queryRepo.findCommentByIdOrFail(commentId);
    if(!comment) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await commentService.updateComment(commentId, req.body);
    res.sendStatus(httpStatus.NoContent)
}