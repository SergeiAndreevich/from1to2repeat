import {inject, injectable} from "inversify";
import {QueryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {PostsService} from "../Entity/Posts/BLL/postsService.bll";
import {CommentService} from "../Entity/Comments/BLL/commentService.bll";
import {Request, Response} from "express";
import {
    CommentsSortFields,
    IPAginationAndSorting,
    PostsSortFields
} from "../core/pagination/pagination-and-sorting.types";
import {setPaginationAndSortingFilter} from "../core/pagination/pagination-and-sorting.helper";
import {httpStatus} from "../core/types/httpStatuses.type";
import {TypeCommentatorInfo, TypeCommentInputModel} from "../Entity/Comments/Comment.types";

@injectable()
export class PostsController {
    constructor(@inject(QueryRepo)protected queryRepo: QueryRepo,
                @inject(PostsService)protected postsService: PostsService,
                @inject(CommentService)protected commentService: CommentService){}
    async getAllPostsHandler(req:Request, res:Response) {
        const query:Partial<IPAginationAndSorting<PostsSortFields>> = req.query;
        const filter = setPaginationAndSortingFilter<PostsSortFields>(query);
        const postsList = await this.queryRepo.findAllPostsByFilter(filter);
        res.status(httpStatus.Ok).send(postsList)
    }
    async getPostByIdHandler(req:Request,res:Response) {
        const post = await this.queryRepo.findPostByIdOrFail(req.params.id);
        //отработали 404
        if(!post) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(post)

    }
    async createPostHandler(req:Request, res:Response) {
        const createdId = await this.postsService.createPost(req.body);
        //доп проверка
        if(!createdId){
            res.sendStatus(httpStatus.ExtraError);
            return
        }
        const createdPost = await this.queryRepo.findPostByIdOrFail(createdId);
        if(!createdPost){
            res.sendStatus(httpStatus.ExtraError);
            return
        }
        //по документации тут должен быть только 201 и ничего другого, но я сделал отсебятины
        res.status(httpStatus.Created).send(createdPost)
    }
    async changePostHandler(req:Request,res:Response) {
        const postId = req.params.id;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        //отработали 404
        if(!post){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        await this.postsService.updatePost(postId,req.body);
        res.sendStatus(httpStatus.NoContent)
    }
    async removePostHandler(req:Request,res:Response) {
        const postId = req.params.id;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        //здесь 404
        if(!post){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        await this.postsService.removePost(postId);
        res.sendStatus(httpStatus.NoContent)
    }
    async createCommentForPostHandler(req:Request, res: Response) {
        const postId = req.params.postId;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        if(!post){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const commentInput:TypeCommentInputModel = req.body;
        if(!req.userId){
            res.sendStatus(httpStatus.BadRequest);
            return
        }
        const commentator = await this.queryRepo.findUserByIdOrFail(req.userId);
        if(!commentator){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const commentatorInfo:TypeCommentatorInfo = {
            userId: commentator.id,
            userLogin: commentator.login
        }
        const createdId = await this.commentService.createComment(post.id, commentInput, commentatorInfo);
        const comment = await this.queryRepo.findCommentByIdOrFail(createdId);
        if(!comment) {
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Created).send(comment);
    }
    async findCommentForPostHandler(req:Request,res:Response) {
        const query :Partial<IPAginationAndSorting<CommentsSortFields>> = req.query;
        const filter = setPaginationAndSortingFilter(query);
        const postId = req.params.postId;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        if(!post){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        const commentList = await this.queryRepo.findCommentsByPostIdOrFail(filter, postId);
        if(!commentList){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(commentList)
    }
}