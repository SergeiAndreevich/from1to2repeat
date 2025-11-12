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
exports.PostsService = void 0;
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const postsRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/postsRepository.repository");
const inversify_1 = require("inversify");
// export const postsService = {
//     async  createPost(dto: TypePostInputModel){
//         const blog = await queryRepo.findBlogByIdOrFail(dto.blogId);
//         const newPost:TypePost = {
//             title: dto.title,
//             shortDescription: dto.shortDescription,
//             content: dto.shortDescription,
//             blogId: dto.blogId,
//             blogName: blog!.name,
//             createdAt: blog!.createdAt
//         }
//         const createdId = await postsRepository.createPost(newPost);
//         return createdId
//     },
//     async updatePost(postId: string,dto: TypePostInputModel){
//         await postsRepository.updatePost(postId, dto);
//         return
//     },
//     async removePost(postId: string){
//      await postsRepository.removePost(postId);
//      return
//     }
// }
let PostsService = class PostsService {
    constructor(postsRepository, queryRepo) {
        this.postsRepository = postsRepository;
        this.queryRepo = queryRepo;
    }
    async createPost(dto) {
        const blog = await this.queryRepo.findBlogByIdOrFail(dto.blogId);
        const newPost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.shortDescription,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: blog.createdAt
        };
        const createdId = await this.postsRepository.createPost(newPost);
        return createdId;
    }
    async updatePost(postId, dto) {
        await this.postsRepository.updatePost(postId, dto);
        return;
    }
    async removePost(postId) {
        await this.postsRepository.removePost(postId);
        return;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(postsRepository_repository_1.PostsRepository)),
    __param(1, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __metadata("design:paramtypes", [postsRepository_repository_1.PostsRepository,
        queryRepo_repository_1.QueryRepo])
], PostsService);
