"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const tockenGuard_middleware_1 = require("../core/auth/tockenGuard.middleware");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const getCommentById_handler_1 = require("../Entity/Comments/handlers/getCommentById.handler");
const commentInputValidation_validation_1 = require("../core/validation/commentInputValidation.validation");
const updateComment_handler_1 = require("../Entity/Comments/handlers/updateComment.handler");
const removeCommentById_handler_1 = require("../Entity/Comments/handlers/removeCommentById.handler");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, getCommentById_handler_1.getCommentByIdHandler)
    .put('/:commentId', tockenGuard_middleware_1.tokenGuard, paramsIdValidation_validation_1.idValidation, commentInputValidation_validation_1.commentInputValidation, validationErrorResult_handler_1.checkValidationErrors, updateComment_handler_1.updateCommentHandler)
    .delete('/:commentId', tockenGuard_middleware_1.tokenGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, removeCommentById_handler_1.removeCommentByIdHandler);
