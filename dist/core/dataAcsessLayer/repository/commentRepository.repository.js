"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRepository = exports.CommentRepository = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mongodb_1 = require("mongodb");
// export const commentRepository = {
//     async removeComment(commentId: string) {
//         await commentsCollection.deleteOne({_id: new ObjectId(commentId)});
//         return
//     },
//     async createComment( newComment: TypeComment) {
//         const createdComment = await commentsCollection.insertOne(newComment);
//         return createdComment.insertedId.toString()
//     },
//     async updateComment(id: string,dto: TypeCommentInputModel): Promise<void> {
//         await commentsCollection.updateOne({_id: new ObjectId(id)},
//             {
//                 $set: {
//                     content: dto.content
//                 }
//             });
//         return
//     }
// }
class CommentRepository {
    async removeComment(commentId) {
        await mongoDB_db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
        return;
    }
    async createComment(newComment) {
        const createdComment = await mongoDB_db_1.commentsCollection.insertOne(newComment);
        return createdComment.insertedId.toString();
    }
    async updateComment(id, dto) {
        await mongoDB_db_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                content: dto.content
            }
        });
        return;
    }
}
exports.CommentRepository = CommentRepository;
exports.commentRepository = new CommentRepository();
