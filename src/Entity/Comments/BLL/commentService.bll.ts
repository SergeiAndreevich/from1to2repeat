import {TypeComment, TypeCommentatorInfo, TypeCommentInputModel} from "../Comment.types";
import {commentRepository} from "../../../core/dataAcsessLayer/repository/commentRepository.repository";

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

export class CommentService {
    async updateComment(commentId:string, dto: TypeCommentInputModel){
        await commentRepository.updateComment(commentId, dto);
        return
    }
    async createComment(postId:string, commentContent: TypeCommentInputModel, userInfo:TypeCommentatorInfo){
        const comment:TypeComment = {
            content: commentContent.content,
            commentatorInfo: userInfo,
            createdAt: new Date(),
            postId: postId
        }
        const createdId = await commentRepository.createComment(comment);
        return createdId
    }
    async removeComment(commentId:string){
        await commentRepository.removeComment(commentId);
        return
    }
}

export const commentService = new CommentService();