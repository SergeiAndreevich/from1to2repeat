"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const commentInputValidation_validation_1 = require("../core/validation/commentInputValidation.validation");
const composition_root_1 = require("../composition-root");
const comments_1 = require("../classes/comments");
exports.commentsRouter = (0, express_1.Router)({});
const commentController = composition_root_1.container.get(comments_1.CommentsController);
exports.commentsRouter
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, commentController.getCommentByIdHandler.bind(commentController))
    .put('/:id', tockenGuard_middleware_1.tokenGuard, paramsIdValidation_validation_1.idValidation, commentInputValidation_validation_1.commentInputValidation, validationErrorResult_handler_1.checkValidationErrors, commentController.updateCommentHandler.bind(commentController))
    .delete('/:id', tockenGuard_middleware_1.tokenGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, commentController.removeCommentByIdHandler.bind(commentController));
