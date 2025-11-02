import {Request, Response, Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {
    BlogsSortFields, IPAginationAndSorting,
    PostsSortFields
} from "../core/pagination/pagination-and-sorting.types";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {blogInputValidation} from "../core/validation/blogInputValidation.validation";
import {blogIdValidation} from "../core/validation/blogIdValidation.validation";
import {PostToBlogInputValidation} from "../core/validation/postToBlogInputValidation.validation";
import {setPaginationAndSortingFilter} from "../core/pagination/pagination-and-sorting.helper";
import {QueryRepo, queryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../core/types/httpStatuses.type";
import {BlogsService} from "../Entity/Blogs/BLL/blogsService.bll";
import {blogsController} from "../composition-root";

export const blogsRouter = Router({});

//доработай эндпоинты, где есть query
//чудеса! Убираю валидацию квери - и все работает


//при переходе к классам я создаю класс и если в этом классе есть обращение к др классам,
//содержащим вложенность, то я как бы создаю их экземпляр здесь и обращаюсь не как к испортируемуму
//модулю, а как к экземпляру=свойству данного класса
export class BlogsController {
    constructor(protected queryRepo: QueryRepo, protected blogsService: BlogsService) {}
    async getAllBlogsHandler(req:Request,res:Response){
        const query:Partial<IPAginationAndSorting<BlogsSortFields>> = req.query;
        const filter = setPaginationAndSortingFilter<BlogsSortFields>(query);
        const blogsList = await this.queryRepo.findAllBlogsByFilter(filter);
        res.status(httpStatus.Ok).send(blogsList)
    }
    async getBlogByIdHandler(req: Request, res: Response) {
        const  blogId = req.params.id;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //отработали 404
        if(blog === null) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(blog);
    }
    async getPostsForSpecificBlogHandler(req:Request,res:Response) {
        const blogId = req.params.blogId;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //если блог не существует, то 404
        if(!blog){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const query:Partial<IPAginationAndSorting<PostsSortFields>> = req.query;
        const filter:IPAginationAndSorting<PostsSortFields> = setPaginationAndSortingFilter<PostsSortFields>(query);
        const posts = await this.queryRepo.findAllPostsForBlog(blogId, filter);
        res.status(httpStatus.Ok).send(posts)
    }
    async createPostForSpecificBlogHandler(req:Request,res:Response) {
        const blog = await this.queryRepo.findBlogByIdOrFail(req.params.blogId);
        //здесь отрабатывается 404
        if(!blog){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const  createdPostId = await this.blogsService.createPostForSpecificBlog(req.params.blogId, req.body);
        const post = await this.queryRepo.findPostByIdOrFail(createdPostId);
        //доп проверка
        if(!post){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Created).send(post)
    }
    async createBlogHandler(req:Request, res: Response) {
        const createdId = await this.blogsService.createBlog(req.body);
        if(!createdId){
            //доп проверка
            res.sendStatus(httpStatus.ExtraError);
            return
        }
        const newBlog = await this.queryRepo.findBlogByIdOrFail(createdId);
        //если все ок, то 201
        res.status(httpStatus.Created).send(newBlog)
    }
    async updateBlogHandler(req:Request, res: Response) {
        const blogId = req.params.id;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //отработали 404
        if(!blog) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        await this.blogsService.updateBlog(blogId, req.body)
        //отработали 204
        res.sendStatus(httpStatus.NoContent)
    }
    async removeBlogHandler(req:Request, res: Response) {
        const blogId = req.params.id;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //тут отработали 404
        if(!blog) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        await this.blogsService.removeBlog(blogId);
        //а здесь 204
        res.sendStatus(httpStatus.NoContent)
    }
}

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