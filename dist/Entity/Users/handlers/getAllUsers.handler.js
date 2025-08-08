"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersHandler = getUsersHandler;
const pagination_and_sorting_helper_1 = require("../../../core/pagination/pagination-and-sorting.helper");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
function getUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //есть нюанс с фильтром. Он не типизируется как надо. Точнее я не знаю как его типизировать
        //сейчас там лежит стринг, а я хочу чтобы там динамически формировался тип SortFields
        //так хз че я писал выше. Сейчас уже пишу по другому вопросу
        const query = req.query;
        console.log('usersQuery', query);
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const usersList = yield queryRepo_repository_1.queryRepo.findAllUsersByFilter(filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(usersList);
    });
}
//задействованы 200 и 401
//401 отработала в авторизации
