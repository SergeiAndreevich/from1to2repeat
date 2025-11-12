import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {commentInputValidation} from "../core/validation/commentInputValidation.validation";
import {container} from "../composition-root";
import {CommentsController} from "../classes/comments";

export const commentsRouter = Router({});
const commentController = container.get(CommentsController);

commentsRouter
    .get('/:id', idValidation, checkValidationErrors, commentController.getCommentByIdHandler.bind(commentController))
    .put('/:id', tokenGuard, idValidation, commentInputValidation, checkValidationErrors, commentController.updateCommentHandler.bind(commentController))
    .delete('/:id', tokenGuard, idValidation, checkValidationErrors, commentController.removeCommentByIdHandler.bind(commentController))

