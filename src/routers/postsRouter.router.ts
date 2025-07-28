import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {postInputValidation} from "../core/validation/postInputValidation.validation";

export const postsRouter = Router({});

postsRouter
    .get('/')
    .post('/', basicGuard, postInputValidation, checkValidationErrors, createPostHandler)
    .put('/:id', idValidation, postInputValidation, checkValidationErrors, changePostHandler)
    .delete('/:id', idValidation, checkValidationErrors, removePostHandler)
