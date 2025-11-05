import {inject, injectable} from "inversify";
import {Request, Response, Router} from 'express';
import {queryPaginationValidation} from "../core/validation/queryValidation.validation";
import {IPAginationAndSorting, UsersSortFields} from "../core/pagination/pagination-and-sorting.types";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {userInputValidation} from "../core/validation/userInputValidation.validation";
import {getUsersHandler} from "../Entity/Users/handlers/getAllUsers.handler";
import {createUserHandler} from "../Entity/Users/handlers/createUser.handler";
import {removeUserHandler} from "../Entity/Users/handlers/removeUser.handler";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {setPaginationAndSortingFilter} from "../core/pagination/pagination-and-sorting.helper";
import {QueryRepo, queryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../core/types/httpStatuses.type";
import {TypeUserInputModel, TypeUserViewModel} from "../Entity/Users/User.types";
import {UsersService} from "../Entity/Users/BLL/usersService.bll";
import {ResultStatuses} from "../core/types/ResultObject.type";
import {usersRepository} from "../core/dataAcsessLayer/repository/usersRepository.repository";
import {container} from "../composition-root";

export const usersRouter = Router({});

@injectable()
export class UsersController {

    constructor(@inject(QueryRepo)protected queryRepo: QueryRepo,
                @inject(UsersService)protected usersService: UsersService) {
    }
    async getUsersHandler (req:Request, res: Response){
        const query:Partial<IPAginationAndSorting<UsersSortFields>> = req.query;
        const filter = setPaginationAndSortingFilter<UsersSortFields>(query);
        const usersList = await queryRepo.findAllUsersByFilter(filter);
        res.status(httpStatus.Ok).send(usersList)
    }
    async createUserHandler(req:Request, res: Response) {
        //получили данные из req body
        const userInput:TypeUserInputModel = req.body;

        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = await this.usersService.createUserBySuperAdmin(userInput);

        //результат работы по созданию юзера
        if(newUserResult.status === ResultStatuses.alreadyExist){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        const user = await this.queryRepo.findUserByIdOrFail(newUserResult.data!);
        if(!user){
            res.sendStatus(httpStatus.ExtraError);
            return
        }
        res.status(httpStatus.Created).send(user)
    }
    async removeUserHandler(req:Request,res:Response) {
        const userId = req.params.id;
        const user:TypeUserViewModel|null = await this.queryRepo.findUserByIdOrFail(userId);
        //отработали 404
        if(!user){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        await this.usersService.removeUser(user.id);
        res.sendStatus(httpStatus.NoContent)
    }
}
const usersController = container.get(UsersController)

usersRouter
    .get('/', basicGuard, /*queryPaginationValidation(UsersSortFields),*/ checkValidationErrors, usersController.getUsersHandler.bind(usersController))
    .post('/', basicGuard, userInputValidation, checkValidationErrors, usersController.createUserHandler.bind(usersController))
    .delete('/:id', basicGuard, idValidation, checkValidationErrors, usersController.removeUserHandler.bind(usersController))