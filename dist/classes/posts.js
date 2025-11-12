"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const inversify_1 = require("inversify");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const postsService_bll_1 = require("../Entity/Posts/BLL/postsService.bll");
const commentService_bll_1 = require("../Entity/Comments/BLL/commentService.bll");
const pagination_and_sorting_helper_1 = require("../core/pagination/pagination-and-sorting.helper");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
let PostsController = class PostsController {
    constructor(queryRepo, postsService, commentService) {
        this.queryRepo = queryRepo;
        this.postsService = postsService;
        this.commentService = commentService;
    }
    async getAllPostsHandler(req, res) {
        const query = req.query;
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const postsList = await this.queryRepo.findAllPostsByFilter(filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(postsList);
    }
    async getPostByIdHandler(req, res) {
        const post = await this.queryRepo.findPostByIdOrFail(req.params.id);
        //отработали 404
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send(post);
    }
    async createPostHandler(req, res) {
        const createdId = await this.postsService.createPost(req.body);
        //доп проверка
        if (!createdId) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        const createdPost = await this.queryRepo.findPostByIdOrFail(createdId);
        if (!createdPost) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        //по документации тут должен быть только 201 и ничего другого, но я сделал отсебятины
        res.status(httpStatuses_type_1.httpStatus.Created).send(createdPost);
    }
    async changePostHandler(req, res) {
        const postId = req.params.id;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        //отработали 404
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        await this.postsService.updatePost(postId, req.body);
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async removePostHandler(req, res) {
        const postId = req.params.id;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        //здесь 404
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        await this.postsService.removePost(postId);
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async createCommentForPostHandler(req, res) {
        const postId = req.params.postId;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const commentInput = req.body;
        if (!req.userId) {
            res.sendStatus(httpStatuses_type_1.httpStatus.BadRequest);
            return;
        }
        const commentator = await this.queryRepo.findUserByIdOrFail(req.userId);
        if (!commentator) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const commentatorInfo = {
            userId: commentator.id,
            userLogin: commentator.login
        };
        const createdId = await this.commentService.createComment(post.id, commentInput, commentatorInfo);
        const comment = await this.queryRepo.findCommentByIdOrFail(createdId);
        if (!comment) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Created).send(comment);
    }
    async findCommentForPostHandler(req, res) {
        const query = req.query;
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const postId = req.params.postId;
        const post = await this.queryRepo.findPostByIdOrFail(postId);
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const commentList = await this.queryRepo.findCommentsByPostIdOrFail(filter, postId);
        if (!commentList) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send(commentList);
    }
};
exports.PostsController = PostsController;
exports.PostsController = PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(postsService_bll_1.PostsService)),
    __param(2, (0, inversify_1.inject)(commentService_bll_1.CommentService)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        postsService_bll_1.PostsService,
        commentService_bll_1.CommentService])
], PostsController);
