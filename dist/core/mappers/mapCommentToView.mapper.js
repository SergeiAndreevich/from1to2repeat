"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCommentToView = mapCommentToView;
function mapCommentToView(comment) {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    };
}
