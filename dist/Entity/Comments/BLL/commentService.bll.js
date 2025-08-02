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
exports.commentService = void 0;
const repository_repository_1 = require("../../../core/dataAcsessLayer/repository.repository");
exports.commentService = {
    updateComment(commentId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield repository_repository_1.repository.updateComment(commentId, dto);
            return;
        });
    },
    createComment(postId, commentContent, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = {
                content: commentContent.content,
                commentatorInfo: userInfo,
                createdAt: new Date(),
                postId: postId
            };
            const createdId = yield repository_repository_1.repository.createComment(comment);
            return createdId;
        });
    },
    removeComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield repository_repository_1.repository.removeComment(commentId);
            return;
        });
    }
};
