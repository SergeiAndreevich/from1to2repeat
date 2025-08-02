"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const paramsIdValidation_validation_1 = require("../core/validation/paramsIdValidation.validation");
const pagination_and_sorting_types_1 = require("../core/pagination/pagination-and-sorting.types");
const queryValidation_validation_1 = require("../core/validation/queryValidation.validation");
const validationErrorResult_handler_1 = require("../core/errors/validationErrorResult.handler");
const getAllBlogs_handler_1 = require("../Entity/Blogs/handlers/getAllBlogs.handler");
const basicGuard_middleware_1 = require("../core/auth/basicGuard.middleware");
const blogInputValidation_validation_1 = require("../core/validation/blogInputValidation.validation");
const blogIdValidation_validation_1 = require("../core/validation/blogIdValidation.validation");
const postToBlogInputValidation_validation_1 = require("../core/validation/postToBlogInputValidation.validation");
const getBlogById_handler_1 = require("../Entity/Blogs/handlers/getBlogById.handler");
const createPostForSpecificBlog_handler_1 = require("../Entity/Blogs/handlers/createPostForSpecificBlog.handler");
const createBlog_handler_1 = require("../Entity/Blogs/handlers/createBlog.handler");
const updateBlog_handler_1 = require("../Entity/Blogs/handlers/updateBlog.handler");
const removeBlog_handler_1 = require("../Entity/Blogs/handlers/removeBlog.handler");
const getPostsForSpecificBlog_handler_1 = require("../Entity/Blogs/handlers/getPostsForSpecificBlog.handler");
exports.blogsRouter = (0, express_1.Router)({});
//доработай эндпоинты, где есть query
exports.blogsRouter
    .get('/', (0, queryValidation_validation_1.queryPaginationValidation)(pagination_and_sorting_types_1.BlogsSortFields), validationErrorResult_handler_1.checkValidationErrors, getAllBlogs_handler_1.getAllBlogsHandler)
    .get('/:id', paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, getBlogById_handler_1.getBlogByIdHandler)
    .get('/:blogId/posts', blogIdValidation_validation_1.blogIdValidation, (0, queryValidation_validation_1.queryPaginationValidation)(pagination_and_sorting_types_1.BlogsSortFields), validationErrorResult_handler_1.checkValidationErrors, getPostsForSpecificBlog_handler_1.getPostsForSpecificBlogHandler)
    .post('/:blogId/posts', basicGuard_middleware_1.basicGuard, blogIdValidation_validation_1.blogIdValidation, postToBlogInputValidation_validation_1.PostToBlogInputValidation, validationErrorResult_handler_1.checkValidationErrors, createPostForSpecificBlog_handler_1.createPostForSpecificBlogHandler)
    .post('/', basicGuard_middleware_1.basicGuard, blogInputValidation_validation_1.blogInputValidation, validationErrorResult_handler_1.checkValidationErrors, createBlog_handler_1.createBlogHandler)
    .put('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, blogInputValidation_validation_1.blogInputValidation, validationErrorResult_handler_1.checkValidationErrors, updateBlog_handler_1.updateBlogHandler)
    .delete('/:id', basicGuard_middleware_1.basicGuard, paramsIdValidation_validation_1.idValidation, validationErrorResult_handler_1.checkValidationErrors, removeBlog_handler_1.removeBlogHandler);
