import {Request, Response} from "express";
import {commentService} from "../BLL/commentService.bll";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function removeCommentByIdHandler(req:Request,res:Response) {
    const commentId = req.params.commentId;
    await commentService.removeComment(commentId);
    res.sendStatus(httpStatus.NoContent)
}