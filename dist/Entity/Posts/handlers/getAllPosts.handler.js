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
exports.getAllPostsHandler = getAllPostsHandler;
const pagination_and_sorting_helper_1 = require("../../../core/pagination/pagination-and-sorting.helper");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
function getAllPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query;
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const postsList = yield queryRepo_repository_1.queryRepo.findAllPostsByFilter(filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(postsList);
    });
}
