import {TypeComment, TypeCommentViewModel} from "../../Entity/Comments/Comment.types";
import {WithId} from "mongodb";

export function mapCommentToView(comment: WithId<TypeComment>):TypeCommentViewModel {
    return {
        id:comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
}