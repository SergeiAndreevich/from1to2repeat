import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {BlogsSortFields, paginationAndSortingDefault} from "../core/pagination/pagination-and-sorting.types";
import {queryPaginationValidation} from "../core/validation/queryValidation.validation";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {getAllBlogsHandler} from "../Entity/Blogs/handlers/getAllBlogs.handler";
import {basicGuard} from "../core/auth/basicGuard.middleware";

export const blogsRouter = Router({});

blogsRouter
    .get('/', queryPaginationValidation(BlogsSortFields), checkValidationErrors, getAllBlogsHandler)
    .post('/', basicGuard, blogInputValidation, checkValidationErrors, createBlogHandler)
    .put('/:id', idValidation)
    .delete('/:id', idValidation)