import {inject, injectable} from "inversify";
import {QueryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {CommentService} from "../Entity/Comments/BLL/commentService.bll";
import {Request, Response} from "express";
import {httpStatus} from "../core/types/httpStatuses.type";

@injectable()
export class CommentsController {
    constructor(@inject(QueryRepo)protected queryRepo: QueryRepo,
                @inject(CommentService) protected commentService: CommentService) {}
    async getCommentByIdHandler(req:Request, res: Response) {
        const comment = await this.queryRepo.findCommentByIdOrFail(req.params.id);
        if(!comment) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(comment)
    }
    async updateCommentHandler(req: Request, res: Response) {
        const commentId = req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        const comment = await this.queryRepo.findCommentByIdOrFail(commentId);
        if(!user || !comment) {
            res.sendStatus(httpStatus.NotFound);
            return
        }

        if(comment.commentatorInfo.userId  === user.id) {
            await this.commentService.updateComment(commentId, req.body);
            res.sendStatus(httpStatus.NoContent);
            return
        }
        res.sendStatus(httpStatus.Forbidden)
    }
    async removeCommentByIdHandler(req:Request,res:Response) {
        const commentId = req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        const comment = await this.queryRepo.findCommentByIdOrFail(commentId);
        if(!user || !comment) {
            res.sendStatus(httpStatus.NotFound);
            return
        }

        if(comment.commentatorInfo.userId  === user.id) {
            await this.commentService.removeComment(commentId);
            res.sendStatus(httpStatus.NoContent);
            return
        }
        res.sendStatus(httpStatus.Forbidden)
    }
}
