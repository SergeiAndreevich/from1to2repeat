import {inject, injectable} from "inversify";
import { QueryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {UsersService} from "../Entity/Users/BLL/usersService.bll";
import {Request, Response} from "express";
import {IPAginationAndSorting, UsersSortFields} from "../core/pagination/pagination-and-sorting.types";
import {setPaginationAndSortingFilter} from "../core/pagination/pagination-and-sorting.helper";
import {httpStatus} from "../core/types/httpStatuses.type";
import {TypeUserInputModel, TypeUserViewModel} from "../Entity/Users/User.types";
import {ResultStatuses} from "../core/types/ResultObject.type";


@injectable()
export class UsersController {

    constructor(@inject(QueryRepo)protected queryRepo: QueryRepo,
                @inject(UsersService)protected usersService: UsersService) {
    }
    async getUsersHandler (req:Request, res: Response){
        const query:Partial<IPAginationAndSorting<UsersSortFields>> = req.query;
        const filter = setPaginationAndSortingFilter<UsersSortFields>(query);
        const usersList = await this.queryRepo.findAllUsersByFilter(filter);
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