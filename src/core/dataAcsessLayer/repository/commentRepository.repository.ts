import {commentsCollection} from "../../db/mongoDB.db";
import {ObjectId} from "mongodb";
import {TypeComment, TypeCommentInputModel} from "../../../Entity/Comments/Comment.types";

export const commentRepository = {
    async removeComment(commentId: string) {
        await commentsCollection.deleteOne({_id: new ObjectId(commentId)});
        return
    },
    async createComment( newComment: TypeComment) {
        const createdComment = await commentsCollection.insertOne(newComment);
        return createdComment.insertedId.toString()
    },
    async updateComment(id: string,dto: TypeCommentInputModel): Promise<void> {
        await commentsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    content: dto.content
                }
            });
        return
    }
}