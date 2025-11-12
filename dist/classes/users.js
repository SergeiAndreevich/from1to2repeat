"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const inversify_1 = require("inversify");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const usersService_bll_1 = require("../Entity/Users/BLL/usersService.bll");
const pagination_and_sorting_helper_1 = require("../core/pagination/pagination-and-sorting.helper");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
const ResultObject_type_1 = require("../core/types/ResultObject.type");
let UsersController = class UsersController {
    constructor(queryRepo, usersService) {
        this.queryRepo = queryRepo;
        this.usersService = usersService;
    }
    async getUsersHandler(req, res) {
        const query = req.query;
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const usersList = await this.queryRepo.findAllUsersByFilter(filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(usersList);
    }
    async createUserHandler(req, res) {
        //получили данные из req body
        const userInput = req.body;
        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = await this.usersService.createUserBySuperAdmin(userInput);
        //результат работы по созданию юзера
        if (newUserResult.status === ResultObject_type_1.ResultStatuses.alreadyExist) {
            res.sendStatus(httpStatuses_type_1.httpStatus.Unauthorized);
            return;
        }
        const user = await this.queryRepo.findUserByIdOrFail(newUserResult.data);
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Created).send(user);
    }
    async removeUserHandler(req, res) {
        const userId = req.params.id;
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        //отработали 404
        if (!user) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        await this.usersService.removeUser(user.id);
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
};
exports.UsersController = UsersController;
exports.UsersController = UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(usersService_bll_1.UsersService)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        usersService_bll_1.UsersService])
], UsersController);
