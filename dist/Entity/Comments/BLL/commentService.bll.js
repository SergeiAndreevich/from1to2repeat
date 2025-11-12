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
exports.CommentService = void 0;
const commentRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/commentRepository.repository");
const inversify_1 = require("inversify");
// export const commentService = {
//     async updateComment(commentId:string, dto: TypeCommentInputModel){
//         await commentRepository.updateComment(commentId, dto);
//         return
//     },
//     async createComment(postId:string, commentContent: TypeCommentInputModel, userInfo:TypeCommentatorInfo){
//         const comment:TypeComment = {
//             content: commentContent.content,
//             commentatorInfo: userInfo,
//             createdAt: new Date(),
//             postId: postId
//         }
//         const createdId = await commentRepository.createComment(comment);
//         return createdId
//     },
//     async removeComment(commentId:string){
//         await commentRepository.removeComment(commentId);
//         return
//     }
// }
let CommentService = class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async updateComment(commentId, dto) {
        await this.commentRepository.updateComment(commentId, dto);
        return;
    }
    async createComment(postId, commentContent, userInfo) {
        const comment = {
            content: commentContent.content,
            commentatorInfo: userInfo,
            createdAt: new Date(),
            postId: postId
        };
        const createdId = await this.commentRepository.createComment(comment);
        return createdId;
    }
    async removeComment(commentId) {
        await this.commentRepository.removeComment(commentId);
        return;
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(commentRepository_repository_1.CommentRepository)),
    __metadata("design:paramtypes", [commentRepository_repository_1.CommentRepository])
], CommentService);
