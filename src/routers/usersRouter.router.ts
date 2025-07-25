import {Router} from 'express';
import {queryPaginationValidation} from "../core/validation/queryValidation.validation";
import {UsersSortFields} from "../core/pagination/pagination-and-sorting.types";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {userInputValidation} from "../core/validation/userInputValidation.validation";
import {getUsersHandler} from "../Entity/Users/handlers/getAllUsers.handler";
import {createUserHandler} from "../Entity/Users/handlers/createUser.handler";
import {removeUserHandler} from "../Entity/Users/handlers/removeUser.handler";

export const usersRouter = Router({});

usersRouter
    .get('/', queryPaginationValidation(UsersSortFields), checkValidationErrors, getUsersHandler)
    .post('/', userInputValidation, checkValidationErrors, createUserHandler)
    .delete('/:id', idValidation, checkValidationErrors, removeUserHandler)