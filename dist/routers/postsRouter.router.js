"use strict";
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
const queryValidation_validation_1 = require("../core/validation/queryValidation.validation");
const pagination_and_sorting_types_1 = require("../core/pagination/pagination-and-sorting.types");
const getAllPosts_handler_1 = require("../Entity/Posts/handlers/getAllPosts.handler");
const createCommentForPost_handler_1 = require("../Entity/Posts/handlers/createCommentForPost.handler");
const findCommentForPost_handler_1 = require("../Entity/Posts/handlers/findCommentForPost.handler");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('/', (0, queryValidation_validation_1.queryPaginationValidation)(pagination_and_sorting_types_1.PostsSortFields), validationErrorResult_handler_1.checkValidationErrors, getAllPosts_handler_1.getAllPostsHandler)
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, getPostById_handler_1.getPostByIdHandler)
    .post('/', basicGuard_middleware_1.basicGuard, postInputValidation_validation_1.postInputValidation, validationErrorResult_handler_1.checkValidationErrors, createPost_handler_1.createPostHandler)
    .put('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, postInputValidation_validation_1.postInputValidation, validationErrorResult_handler_1.checkValidationErrors, changePost_handler_1.changePostHandler)
    .delete('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, removePost_handler_1.removePostHandler)
    .post('/:postId/comments', tockenGuard_middleware_1.tokenGuard, postIdValidation_validation_1.postIdValidation, commentInputValidation_validation_1.commentInputValidation, validationErrorResult_handler_1.checkValidationErrors, createCommentForPost_handler_1.createCommentForPostHandler)
    .get('/:postId/comments', postIdValidation_validation_1.postIdValidation, (0, queryValidation_validation_1.queryPaginationValidation)(pagination_and_sorting_types_1.PostsSortFields), validationErrorResult_handler_1.checkValidationErrors, findCommentForPost_handler_1.findCommentForPostHandler);
