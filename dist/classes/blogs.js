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
exports.BlogsController = void 0;
const pagination_and_sorting_helper_1 = require("../core/pagination/pagination-and-sorting.helper");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
const blogsService_bll_1 = require("../Entity/Blogs/BLL/blogsService.bll");
const inversify_1 = require("inversify");
let BlogsController = class BlogsController {
    constructor(queryRepo, blogsService) {
        this.queryRepo = queryRepo;
        this.blogsService = blogsService;
    }
    async getAllBlogsHandler(req, res) {
        const query = req.query;
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const blogsList = await this.queryRepo.findAllBlogsByFilter(filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(blogsList);
    }
    async getBlogByIdHandler(req, res) {
        const blogId = req.params.id;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //отработали 404
        if (blog === null) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send(blog);
    }
    async getPostsForSpecificBlogHandler(req, res) {
        const blogId = req.params.blogId;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //если блог не существует, то 404
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const query = req.query;
        const filter = (0, pagination_and_sorting_helper_1.setPaginationAndSortingFilter)(query);
        const posts = await this.queryRepo.findAllPostsForBlog(blogId, filter);
        res.status(httpStatuses_type_1.httpStatus.Ok).send(posts);
    }
    async createPostForSpecificBlogHandler(req, res) {
        const blog = await this.queryRepo.findBlogByIdOrFail(req.params.blogId);
        //здесь отрабатывается 404
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const createdPostId = await this.blogsService.createPostForSpecificBlog(req.params.blogId, req.body);
        const post = await this.queryRepo.findPostByIdOrFail(createdPostId);
        //доп проверка
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Created).send(post);
    }
    async createBlogHandler(req, res) {
        const createdId = await this.blogsService.createBlog(req.body);
        if (!createdId) {
            //доп проверка
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        const newBlog = await this.queryRepo.findBlogByIdOrFail(createdId);
        //если все ок, то 201
        res.status(httpStatuses_type_1.httpStatus.Created).send(newBlog);
    }
    async updateBlogHandler(req, res) {
        const blogId = req.params.id;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //отработали 404
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        await this.blogsService.updateBlog(blogId, req.body);
        //отработали 204
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
    async removeBlogHandler(req, res) {
        const blogId = req.params.id;
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        //тут отработали 404
        if (!blog) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        await this.blogsService.removeBlog(blogId);
        //а здесь 204
        res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
    }
};
exports.BlogsController = BlogsController;
exports.BlogsController = BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(blogsService_bll_1.BlogsService)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        blogsService_bll_1.BlogsService])
], BlogsController);
