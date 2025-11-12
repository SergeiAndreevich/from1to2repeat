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
exports.BlogsService = void 0;
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const postsRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/postsRepository.repository");
const blogsRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/blogsRepository.repository");
const inversify_1 = require("inversify");
// export const blogsService = {
//     async createPostForSpecificBlog(blogId: string, dto: TypeBlogPostInputModel) {
//         const blog = await queryRepo.findBlogByIdOrFail(blogId);
//         const newPost:TypePost = {
//             title: dto.title,
//             shortDescription: dto.shortDescription,
//             content: dto.content,
//             blogId: blogId,
//             blogName: blog!.name,
//             createdAt: blog!.createdAt
//         }
//         const createdPostId = await postsRepository.createPost(newPost);
//         return createdPostId
//     },
//     async createBlog(dto:TypeBlogInputModel){
//             const newBlog: TypeBlog = {
//                 name: dto.name,
//                 description: dto.description,
//                 websiteUrl: dto.websiteUrl,
//                 createdAt: new Date(),
//                 isMembership: false
//             }
//             const createdBlogId = await blogsRepository.createBlog(newBlog);
//             return createdBlogId
//     },
//     async updateBlog(blogId: string, dto: TypeBlogInputModel) {
//         return await blogsRepository.updateBlog(blogId, dto)
//     },
//     async removeBlog(blogId: string){
//         await blogsRepository.removeBlog(blogId);
//         return
//
//     }
// }
let BlogsService = class BlogsService {
    constructor(queryRepo, postsRepository, blogsRepository) {
        this.queryRepo = queryRepo;
        this.postsRepository = postsRepository;
        this.blogsRepository = blogsRepository;
    }
    async createPostForSpecificBlog(blogId, dto) {
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        const newPost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: blog.createdAt
        };
        const createdPostId = await this.postsRepository.createPost(newPost);
        return createdPostId;
    }
    async createBlog(dto) {
        const newBlog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        };
        const createdBlogId = await this.blogsRepository.createBlog(newBlog);
        return createdBlogId;
    }
    async updateBlog(blogId, dto) {
        return await this.blogsRepository.updateBlog(blogId, dto);
    }
    async removeBlog(blogId) {
        await this.blogsRepository.removeBlog(blogId);
        return;
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(postsRepository_repository_1.PostsRepository)),
    __param(2, (0, inversify_1.inject)(blogsRepository_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        postsRepository_repository_1.PostsRepository,
        blogsRepository_repository_1.BlogsRepository])
], BlogsService);
