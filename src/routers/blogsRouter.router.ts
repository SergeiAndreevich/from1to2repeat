import {Request, Response, Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {blogInputValidation} from "../core/validation/blogInputValidation.validation";
import {blogIdValidation} from "../core/validation/blogIdValidation.validation";
import {PostToBlogInputValidation} from "../core/validation/postToBlogInputValidation.validation";
import { container} from "../composition-root";
import {BlogsController} from "../classes/blogs";

export const blogsRouter = Router({});
//доработай эндпоинты, где есть query
//чудеса! Убираю валидацию квери - и все работает
const blogsController = container.get(BlogsController);

blogsRouter
    .get('/', /*queryPaginationValidation(BlogsSortFields), checkValidationErrors,*/ blogsController.getAllBlogsHandler.bind(blogsController))
    .get('/:id', idValidation, checkValidationErrors,blogsController.getBlogByIdHandler.bind(blogsController))
    .get('/:blogId/posts', blogIdValidation, /*queryPaginationValidation(PostsSortFields),*/ checkValidationErrors, blogsController.getPostsForSpecificBlogHandler.bind(blogsController))
    .post('/:blogId/posts', basicGuard, blogIdValidation, PostToBlogInputValidation, checkValidationErrors, blogsController.createPostForSpecificBlogHandler.bind(blogsController))
    .post('/', basicGuard, blogInputValidation, checkValidationErrors, blogsController.createBlogHandler.bind(blogsController))
    .put('/:id', basicGuard, idValidation, blogInputValidation, checkValidationErrors, blogsController.updateBlogHandler.bind(blogsController))
    .delete('/:id', basicGuard, idValidation, checkValidationErrors, blogsController.removeBlogHandler.bind(blogsController))

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