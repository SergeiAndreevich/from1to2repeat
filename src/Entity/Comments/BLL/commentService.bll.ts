import {TypeComment, TypeCommentatorInfo, TypeCommentInputModel} from "../Comment.types";
import {
    CommentRepository,
    commentRepository
} from "../../../core/dataAcsessLayer/repository/commentRepository.repository";
import {inject, injectable} from "inversify";

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

@injectable()
export class CommentService {
    constructor(@inject(CommentRepository)protected commentRepository: CommentRepository) {}
    async updateComment(commentId:string, dto: TypeCommentInputModel){
        await this.commentRepository.updateComment(commentId, dto);
        return
    }
    async createComment(postId:string, commentContent: TypeCommentInputModel, userInfo:TypeCommentatorInfo){
        const comment:TypeComment = {
            content: commentContent.content,
            commentatorInfo: userInfo,
            createdAt: new Date(),
            postId: postId
        }
        const createdId = await this.commentRepository.createComment(comment);
        return createdId
    }
    async removeComment(commentId:string){
        await this.commentRepository.removeComment(commentId);
        return
    }
}

