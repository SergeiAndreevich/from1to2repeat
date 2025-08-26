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
exports.postsService = void 0;
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const postsRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/postsRepository.repository");
exports.postsService = {
    createPost(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield queryRepo_repository_1.queryRepo.findBlogByIdOrFail(dto.blogId);
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.shortDescription,
                blogId: dto.blogId,
                blogName: blog.name,
                createdAt: blog.createdAt
            };
            const createdId = yield postsRepository_repository_1.postsRepository.createPost(newPost);
            return createdId;
        });
    },
    updatePost(postId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postsRepository_repository_1.postsRepository.updatePost(postId, dto);
            return;
        });
    },
    removePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postsRepository_repository_1.postsRepository.removePost(postId);
            return;
        });
    }
};
