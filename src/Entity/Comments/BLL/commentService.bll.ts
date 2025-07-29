import {TypeCommentInputModel} from "../Comment.types";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";

export const commentService = {
    async updateComment(commentId:string, dto: TypeCommentInputModel){
        await repository.updateComment(commentId, dto);
        return
    }
}