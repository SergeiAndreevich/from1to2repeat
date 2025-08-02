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
exports.createPostForSpecificBlogHandler = createPostForSpecificBlogHandler;
const blogsService_bll_1 = require("../BLL/blogsService.bll");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
function createPostForSpecificBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blog = yield queryRepo_repository_1.queryRepo.findBlogByIdOrFail(req.params.blogId);
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const createdPostId = yield blogsService_bll_1.blogsService.createPostForSpecificBlog(req.params.blogId, req.body);
        const post = yield queryRepo_repository_1.queryRepo.findPostByIdOrFail(createdPostId);
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Created).send(post);
    });
}
