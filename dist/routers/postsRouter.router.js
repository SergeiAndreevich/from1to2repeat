"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const basicGuard_middleware_1 = require("../core/auth/basicGuard.middleware");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const postInputValidation_validation_1 = require("../core/validation/postInputValidation.validation");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const postIdValidation_validation_1 = require("../core/validation/postIdValidation.validation");
const commentInputValidation_validation_1 = require("../core/validation/commentInputValidation.validation");
const composition_root_1 = require("../composition-root");
const posts_1 = require("../classes/posts");
exports.postsRouter = (0, express_1.Router)({});
const postsController = composition_root_1.container.get(posts_1.PostsController);
exports.postsRouter
    .get('/', /*queryPaginationValidation(PostsSortFields), checkValidationErrors,*/ postsController.getAllPostsHandler.bind(postsController))
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, postsController.getPostByIdHandler.bind(postsController))
    .post('/', basicGuard_middleware_1.basicGuard, postInputValidation_validation_1.postInputValidation, validationErrorResult_handler_1.checkValidationErrors, postsController.createPostHandler.bind(postsController))
    .put('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, postInputValidation_validation_1.postInputValidation, validationErrorResult_handler_1.checkValidationErrors, postsController.changePostHandler.bind(postsController))
    .delete('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, postsController.removePostHandler.bind(postsController))
    .post('/:postId/comments', tockenGuard_middleware_1.tokenGuard, postIdValidation_validation_1.postIdValidation, commentInputValidation_validation_1.commentInputValidation, validationErrorResult_handler_1.checkValidationErrors, postsController.createCommentForPostHandler.bind(postsController))
    .get('/:postId/comments', postIdValidation_validation_1.postIdValidation, /*queryPaginationValidation(PostsSortFields),*/ validationErrorResult_handler_1.checkValidationErrors, postsController.createCommentForPostHandler.bind(postsController));
// .post('/postId/test', tokenGuard, postIdValidation,commentInputValidation, checkValidationErrors, async(req:Request,res:Response)=>{
//     //получаем postId
//     const postId = req.params.postId;
//     const post = await queryRepo.findPostByIdOrFail(postId);
//     if(!post) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     const userId = req.userId;
//     if(!userId) {
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//     const user = await queryRepo.findUserByIdOrFail(userId);
//     if(!user) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     res.status(httpStatus.Created).send({postId: post.id, userId: user.id});
// })
