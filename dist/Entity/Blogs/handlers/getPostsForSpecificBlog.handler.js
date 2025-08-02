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
exports.getPostsForSpecificBlogHandler = getPostsForSpecificBlogHandler;
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const pagination_and_sorting_helper_1 = require("../../../core/pagination/pagination-and-sorting.helper");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
function getPostsForSpecificBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blogId = req.params.blogId;
        const blog = yield queryRepo_repository_1.queryRepo.findBlogByIdOrFail(blogId);
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(req.query);
        const posts = yield queryRepo_repository_1.queryRepo.findAllPostsForBlog(blogId, filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(posts);
    });
}
