import {Request, Response, Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {getCommentByIdHandler} from "../Entity/Comments/handlers/getCommentById.handler";
import {commentInputValidation} from "../core/validation/commentInputValidation.validation";
import {updateCommentHandler} from "../Entity/Comments/handlers/updateComment.handler";
import {removeCommentByIdHandler} from "../Entity/Comments/handlers/removeCommentById.handler";
import {QueryRepo, queryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../core/types/httpStatuses.type";
import {CommentService} from "../Entity/Comments/BLL/commentService.bll";
import {inject, injectable} from "inversify";
import {container} from "../composition-root";

export const commentsRouter = Router({});

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

const commentController = container.get(CommentsController);

commentsRouter
    .get('/:id', idValidation, checkValidationErrors, commentController.getCommentByIdHandler.bind(commentController))
    .put('/:id', tokenGuard, idValidation, commentInputValidation, checkValidationErrors, commentController.updateCommentHandler.bind(commentController))
    .delete('/:id', tokenGuard, idValidation, checkValidationErrors, commentController.removeCommentByIdHandler.bind(commentController))

