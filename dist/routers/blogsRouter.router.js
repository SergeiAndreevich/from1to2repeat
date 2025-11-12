"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const basicGuard_middleware_1 = require("../core/auth/basicGuard.middleware");
const blogInputValidation_validation_1 = require("../core/validation/blogInputValidation.validation");
const blogIdValidation_validation_1 = require("../core/validation/blogIdValidation.validation");
const postToBlogInputValidation_validation_1 = require("../core/validation/postToBlogInputValidation.validation");
const composition_root_1 = require("../composition-root");
const blogs_1 = require("../classes/blogs");
exports.blogsRouter = (0, express_1.Router)({});
//доработай эндпоинты, где есть query
//чудеса! Убираю валидацию квери - и все работает
const blogsController = composition_root_1.container.get(blogs_1.BlogsController);
exports.blogsRouter
    .get('/', /*queryPaginationValidation(BlogsSortFields), checkValidationErrors,*/ blogsController.getAllBlogsHandler.bind(blogsController))
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, blogsController.getBlogByIdHandler.bind(blogsController))
    .get('/:blogId/posts', blogIdValidation_validation_1.blogIdValidation, /*queryPaginationValidation(PostsSortFields),*/ validationErrorResult_handler_1.checkValidationErrors, blogsController.getPostsForSpecificBlogHandler.bind(blogsController))
    .post('/:blogId/posts', basicGuard_middleware_1.basicGuard, blogIdValidation_validation_1.blogIdValidation, postToBlogInputValidation_validation_1.PostToBlogInputValidation, validationErrorResult_handler_1.checkValidationErrors, blogsController.createPostForSpecificBlogHandler.bind(blogsController))
    .post('/', basicGuard_middleware_1.basicGuard, blogInputValidation_validation_1.blogInputValidation, validationErrorResult_handler_1.checkValidationErrors, blogsController.createBlogHandler.bind(blogsController))
    .put('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, blogInputValidation_validation_1.blogInputValidation, validationErrorResult_handler_1.checkValidationErrors, blogsController.updateBlogHandler.bind(blogsController))
    .delete('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, blogsController.removeBlogHandler.bind(blogsController));
//биндим мы для того, чтобы явно указать контекст, т.е.
// const a = {
//     age: 10,
//     getAge(){console.log(this.age)}
// }
// const b = {
//     age:2,
//     getNewAge: a.getAge
// }
//и вот во втором случае контекстом будет уже объект b, вывыдется 2, поэтому нужно явно указывать
