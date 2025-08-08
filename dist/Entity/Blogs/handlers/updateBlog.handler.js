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
exports.updateBlogHandler = updateBlogHandler;
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
const blogsService_bll_1 = require("../BLL/blogsService.bll");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
function updateBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blogId = req.params.id;
        const blog = yield queryRepo_repository_1.queryRepo.findBlogByIdOrFail(blogId);
        //отработали 404
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        yield blogsService_bll_1.blogsService.updateBlog(blogId, req.body);
        //отработали 204
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    });
}
//401 в авторизации
//400 в валидации
//остается 204 и 404
