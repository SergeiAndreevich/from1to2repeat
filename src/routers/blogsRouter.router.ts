import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {
    BlogsSortFields,
    paginationAndSortingDefault,
    PostsSortFields
} from "../core/pagination/pagination-and-sorting.types";
import {queryPaginationValidation} from "../core/validation/queryValidation.validation";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {getAllBlogsHandler} from "../Entity/Blogs/handlers/getAllBlogs.handler";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {blogInputValidation} from "../core/validation/blogInputValidation.validation";
import {blogIdValidation} from "../core/validation/blogIdValidation.validation";
import {PostToBlogInputValidation} from "../core/validation/postToBlogInputValidation.validation";
import {getBlogByIdHandler} from "../Entity/Blogs/handlers/getBlogById.handler";
import {createPostForSpecificBlogHandler} from "../Entity/Blogs/handlers/createPostForSpecificBlog.handler";
import {createBlogHandler} from "../Entity/Blogs/handlers/createBlog.handler";
import {updateBlogHandler} from "../Entity/Blogs/handlers/updateBlog.handler";
import {removeBlogHandler} from "../Entity/Blogs/handlers/removeBlog.handler";
import {getPostsForSpecificBlogHandler} from "../Entity/Blogs/handlers/getPostsForSpecificBlog.handler";

export const blogsRouter = Router({});

//доработай эндпоинты, где есть query
//чудеса! Убираю валидацию квери - и все работает

blogsRouter
    .get('/', queryPaginationValidation(BlogsSortFields), checkValidationErrors, getAllBlogsHandler)
    .get('/:id', idValidation, checkValidationErrors,getBlogByIdHandler)
    .get('/:blogId/posts', blogIdValidation, /*queryPaginationValidation(PostsSortFields),*/ checkValidationErrors, getPostsForSpecificBlogHandler)
    .post('/:blogId/posts', basicGuard, blogIdValidation, PostToBlogInputValidation, checkValidationErrors, createPostForSpecificBlogHandler)
    .post('/', basicGuard, blogInputValidation, checkValidationErrors, createBlogHandler)
    .put('/:id', basicGuard, idValidation, blogInputValidation, checkValidationErrors, updateBlogHandler)
    .delete('/:id', basicGuard, idValidation, checkValidationErrors, removeBlogHandler)
