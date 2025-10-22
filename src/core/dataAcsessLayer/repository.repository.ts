import {IResult, ResultStatuses} from "../types/ResultObject.type";
import {
    authCollection,
    blogsCollection,
    commentsCollection,
    postsCollection,
    protectionCollection,
    usersCollection
} from "../db/mongoDB.db";
import {TypeUser, TypeUserExtended} from "../../Entity/Users/User.types";
import {ObjectId} from "mongodb";
import {TypePost, TypePostInputModel} from "../../Entity/Posts/Post.types";
import {TypeBlog, TypeBlogInputModel} from "../../Entity/Blogs/Blog.types";
import {TypeComment, TypeCommentInputModel} from "../../Entity/Comments/Comment.types";
import {TypeSessionModel} from "../auth/auth.types";

// export const repository = {
//     async removeAllData() {
//         await usersCollection.deleteMany({});
//         await postsCollection.deleteMany({});
//         await blogsCollection.deleteMany({});
//         await commentsCollection.deleteMany({});
//         await authCollection.deleteMany({});
//         await protectionCollection.deleteMany({});
//         return
//     },
// }

class Reporitory {
    async removeAllData() {
        await usersCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await blogsCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await authCollection.deleteMany({});
        await protectionCollection.deleteMany({});
        return
    }
}
export const repository = new Reporitory();