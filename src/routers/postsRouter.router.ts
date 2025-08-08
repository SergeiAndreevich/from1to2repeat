import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {postInputValidation} from "../core/validation/postInputValidation.validation";
import {createPostHandler} from "../Entity/Posts/handlers/createPost.handler";
import {changePostHandler} from "../Entity/Posts/handlers/changePost.handler";
import {removePostHandler} from "../Entity/Posts/handlers/removePost.handler";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {getPostByIdHandler} from "../Entity/Posts/handlers/getPostById.handler";
import {postIdValidation} from "../core/validation/postIdValidation.validation";
import {commentInputValidation} from "../core/validation/commentInputValidation.validation";
import {queryPaginationValidation} from "../core/validation/queryValidation.validation";
import {PostsSortFields} from "../core/pagination/pagination-and-sorting.types";
import {getAllPostsHandler} from "../Entity/Posts/handlers/getAllPosts.handler";
import {createCommentForPostHandler} from "../Entity/Posts/handlers/createCommentForPost.handler";
import {findCommentForPostHandler} from "../Entity/Posts/handlers/findCommentForPost.handler";

export const postsRouter = Router({});

postsRouter
    .get('/', /*queryPaginationValidation(PostsSortFields), checkValidationErrors,*/ getAllPostsHandler)
    .get('/:id', idValidation, checkValidationErrors, getPostByIdHandler)
    .post('/', basicGuard, postInputValidation, checkValidationErrors, createPostHandler)
    .put('/:id', basicGuard, idValidation, postInputValidation, checkValidationErrors, changePostHandler)
    .delete('/:id', basicGuard, idValidation, checkValidationErrors, removePostHandler)
    .post('/:postId/comments', tokenGuard, postIdValidation, commentInputValidation, checkValidationErrors, createCommentForPostHandler)
    .get('/:postId/comments', postIdValidation, /*queryPaginationValidation(PostsSortFields),*/ checkValidationErrors, findCommentForPostHandler)
