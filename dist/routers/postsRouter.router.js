"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const basicGuard_middleware_1 = require("../core/auth/basicGuard.middleware");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const postInputValidation_validation_1 = require("../core/validation/postInputValidation.validation");
const createPost_handler_1 = require("../Entity/Posts/handlers/createPost.handler");
const changePost_handler_1 = require("../Entity/Posts/handlers/changePost.handler");
const removePost_handler_1 = require("../Entity/Posts/handlers/removePost.handler");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const getPostById_handler_1 = require("../Entity/Posts/handlers/getPostById.handler");
const postIdValidation_validation_1 = require("../core/validation/postIdValidation.validation");
const commentInputValidation_validation_1 = require("../core/validation/commentInputValidation.validation");
const getAllPosts_handler_1 = require("../Entity/Posts/handlers/getAllPosts.handler");
const createCommentForPost_handler_1 = require("../Entity/Posts/handlers/createCommentForPost.handler");
const findCommentForPost_handler_1 = require("../Entity/Posts/handlers/findCommentForPost.handler");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('/', /*queryPaginationValidation(PostsSortFields), checkValidationErrors,*/ getAllPosts_handler_1.getAllPostsHandler)
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, getPostById_handler_1.getPostByIdHandler)
    .post('/', basicGuard_middleware_1.basicGuard, postInputValidation_validation_1.postInputValidation, validationErrorResult_handler_1.checkValidationErrors, createPost_handler_1.createPostHandler)
    .put('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, postInputValidation_validation_1.postInputValidation, validationErrorResult_handler_1.checkValidationErrors, changePost_handler_1.changePostHandler)
    .delete('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, removePost_handler_1.removePostHandler)
    .post('/:postId/comments', tockenGuard_middleware_1.tokenGuard, postIdValidation_validation_1.postIdValidation, commentInputValidation_validation_1.commentInputValidation, validationErrorResult_handler_1.checkValidationErrors, createCommentForPost_handler_1.createCommentForPostHandler)
    .get('/:postId/comments', postIdValidation_validation_1.postIdValidation, /*queryPaginationValidation(PostsSortFields),*/ validationErrorResult_handler_1.checkValidationErrors, findCommentForPost_handler_1.findCommentForPostHandler)
    .post('/postId/test', tockenGuard_middleware_1.tokenGuard, postIdValidation_validation_1.postIdValidation, commentInputValidation_validation_1.commentInputValidation, validationErrorResult_handler_1.checkValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //получаем postId
    const postId = req.params.postId;
    const post = yield queryRepo_repository_1.queryRepo.findPostByIdOrFail(postId);
    if (!post) {
        res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
        return;
    }
    const userId = req.userId;
    if (!userId) {
        res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
        return;
    }
    const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(userId);
    if (!user) {
        res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
        return;
    }
    res.status(httpStatuses_type_1.httpStatus.Created).send({ postId: post.id, userId: user.id });
}));
