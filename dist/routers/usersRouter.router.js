"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const userInputValidation_validation_1 = require("../core/validation/userInputValidation.validation");
const basicGuard_middleware_1 = require("../core/auth/basicGuard.middleware");
const composition_root_1 = require("../composition-root");
const users_1 = require("../classes/users");
exports.usersRouter = (0, express_1.Router)({});
const usersController = composition_root_1.container.get(users_1.UsersController);
exports.usersRouter
    .get('/', basicGuard_middleware_1.basicGuard, /*queryPaginationValidation(UsersSortFields),*/ validationErrorResult_handler_1.checkValidationErrors, usersController.getUsersHandler.bind(usersController))
    .post('/', basicGuard_middleware_1.basicGuard, userInputValidation_validation_1.userInputValidation, validationErrorResult_handler_1.checkValidationErrors, usersController.createUserHandler.bind(usersController))
    .delete('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, usersController.removeUserHandler.bind(usersController));
