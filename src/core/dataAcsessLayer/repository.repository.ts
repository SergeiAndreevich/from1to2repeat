import {IResult, ResultStatuses} from "../types/ResultObject.type";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/mongoDB.db";
import {TypeUser} from "../../Entity/Users/User.types";
import {ObjectId} from "mongodb";
import {TypePost, TypePostInputModel} from "../../Entity/Posts/Post.types";
import {TypeBlog, TypeBlogInputModel} from "../../Entity/Blogs/Blog.types";
import {TypeComment, TypeCommentInputModel} from "../../Entity/Comments/Comment.types";

export const repository = {
    async removeAllData() {
        await usersCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await blogsCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        return
    },
}