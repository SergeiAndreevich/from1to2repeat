// import {Request, Response} from "express";
// import {commentService} from "../BLL/commentService.bll";
// import {httpStatus} from "../../../core/types/httpStatuses.type";
// import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
//
// export async function removeCommentByIdHandler(req:Request,res:Response) {
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
//         await commentService.removeComment(commentId);
//         res.sendStatus(httpStatus.NoContent);
//         return
//     }
//     res.sendStatus(httpStatus.Forbidden)
//
// }