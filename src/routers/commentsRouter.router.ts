import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {getCommentByIdHandler} from "../Entity/Comments/handlers/getCommentById.handler";
import {commentInputValidation} from "../core/validation/commentInputValidation.validation";
import {updateCommentHandler} from "../Entity/Comments/handlers/updateComment.handler";
import {removeCommentByIdHandler} from "../Entity/Comments/handlers/removeCommentById.handler";

export const commentsRouter = Router({});

// commentsRouter
//     .get('/:id', idValidation, checkValidationErrors, getCommentByIdHandler)
//     .put('/:commentId', tokenGuard, idValidation, commentInputValidation, checkValidationErrors, updateCommentHandler)
//     .delete('/:commentId', tokenGuard, idValidation, checkValidationErrors, removeCommentByIdHandler)