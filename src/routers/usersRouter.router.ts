import {Router} from 'express';
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {userInputValidation} from "../core/validation/userInputValidation.validation";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {container} from "../composition-root";
import {UsersController} from "../classes/users";

export const usersRouter = Router({});

const usersController = container.get(UsersController)

usersRouter
    .get('/', basicGuard, /*queryPaginationValidation(UsersSortFields),*/ checkValidationErrors, usersController.getUsersHandler.bind(usersController))
    .post('/', basicGuard, userInputValidation, checkValidationErrors, usersController.createUserHandler.bind(usersController))
    .delete('/:id', basicGuard, idValidation, checkValidationErrors, usersController.removeUserHandler.bind(usersController))