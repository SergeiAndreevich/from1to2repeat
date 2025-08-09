import {Request, Response} from 'express';
import {commentService} from "../../Comments/BLL/commentService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {TypeCommentatorInfo, TypeCommentInputModel} from "../../Comments/Comment.types";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function createCommentForPostHandler(req:Request, res: Response) {
    const postId = req.params.postId;
    const post = await queryRepo.findPostByIdOrFail(postId);
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    const commentInput:TypeCommentInputModel = req.body;
    const commentator = await queryRepo.findUserByIdOrFail(req.userId!);
    if(!commentator){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    const commentatorInfo:TypeCommentatorInfo = {
        userId: commentator.id,
        userLogin: commentator.login
    }
    const createdId = await commentService.createComment(postId, commentInput, commentatorInfo);
    const comment = await queryRepo.findCommentByIdOrFail(createdId);
    if(!comment) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    res.status(httpStatus.Created).send(comment);
}
//вроде все ок, перепроверил