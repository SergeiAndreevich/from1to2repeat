import {TypeComment, TypeCommentatorInfo, TypeCommentInputModel} from "../Comment.types";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";

export const commentService = {
    async updateComment(commentId:string, dto: TypeCommentInputModel){
        await repository.updateComment(commentId, dto);
        return
    },
    async createComment(postId:string, commentContent: TypeCommentInputModel, userInfo:TypeCommentatorInfo){
        const comment:TypeComment = {
            content: commentContent.content,
            commentatorInfo: userInfo,
            createdAt: new Date()
        }
        const createdId = await repository.createComment(postId, comment);
        return createdId
    },
    async removeComment(commentId:string){
        await repository.removeComment(commentId);
        return
    }
}