"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const queryValidation_validation_1 = require("../core/validation/queryValidation.validation");
const pagination_and_sorting_types_1 = require("../core/pagination/pagination-and-sorting.types");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const userInputValidation_validation_1 = require("../core/validation/userInputValidation.validation");
const getAllUsers_handler_1 = require("../Entity/Users/handlers/getAllUsers.handler");
const createUser_handler_1 = require("../Entity/Users/handlers/createUser.handler");
const removeUser_handler_1 = require("../Entity/Users/handlers/removeUser.handler");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter
    .get('/', (0, queryValidation_validation_1.queryPaginationValidation)(pagination_and_sorting_types_1.UsersSortFields), validationErrorResult_handler_1.checkValidationErrors, getAllUsers_handler_1.getUsersHandler)
    .post('/', userInputValidation_validation_1.userInputValidation, validationErrorResult_handler_1.checkValidationErrors, createUser_handler_1.createUserHandler)
    .delete('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, removeUser_handler_1.removeUserHandler);
