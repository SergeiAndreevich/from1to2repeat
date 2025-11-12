"use strict";
// import {Request, Response} from "express";
// import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
// import {httpStatus} from "../../../core/types/httpStatuses.type";
// import {commentsCollection} from "../../../core/db/mongoDB.db";
// import {commentService} from "../BLL/commentService.bll";
//
// export async function updateCommentHandler(req: Request, res: Response) {
//     const commentId = req.params.id;
//     const userId = req.userId;
//     if (!userId) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     const user = await queryRepo.findUserByIdOrFail(userId);
//     const comment = await queryRepo.findCommentByIdOrFail(commentId);
//     if(!user || !comment) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//
//     if(comment.commentatorInfo.userId  === user.id) {
//         await commentService.updateComment(commentId, req.body);
//         res.sendStatus(httpStatus.NoContent);
//         return
//     }
//     res.sendStatus(httpStatus.Forbidden)
// }
