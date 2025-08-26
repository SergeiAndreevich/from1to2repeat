"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsService = void 0;
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const postsRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/postsRepository.repository");
const blogsRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/blogsRepository.repository");
exports.blogsService = {
    createPostForSpecificBlog(blogId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield queryRepo_repository_1.queryRepo.findBlogByIdOrFail(blogId);
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: blog.createdAt
            };
            const createdPostId = yield postsRepository_repository_1.postsRepository.createPost(newPost);
            return createdPostId;
        });
    },
    createBlog(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl,
                createdAt: new Date(),
                isMembership: false
            };
            const createdBlogId = yield blogsRepository_repository_1.blogsRepository.createBlog(newBlog);
            return createdBlogId;
        });
    },
    updateBlog(blogId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogsRepository_repository_1.blogsRepository.updateBlog(blogId, dto);
        });
    },
    removeBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogsRepository_repository_1.blogsRepository.removeBlog(blogId);
            return;
        });
    }
};
