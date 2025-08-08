import {IResult, ResultStatuses} from "../types/ResultObject.type";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/mongoDB.db";
import {TypeUser} from "../../Entity/Users/User.types";
import {ObjectId} from "mongodb";
import {TypePost, TypePostInputModel} from "../../Entity/Posts/Post.types";
import {TypeBlog, TypeBlogInputModel} from "../../Entity/Blogs/Blog.types";
import {TypeComment, TypeCommentInputModel} from "../../Entity/Comments/Comment.types";

export const repository = {
    async findUserByLoginOrFail(userLogin: string): Promise<IResult<string | null>> {
        const user = await usersCollection.findOne({login: userLogin});
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    },
    async findUserByEmailOrFail(userEmail: string): Promise<IResult<string | null>> {
        const user = await usersCollection.findOne({email: userEmail});
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    },
    async createUser(newUser: TypeUser) {
        const createdUser = await usersCollection.insertOne(newUser);
        return createdUser.insertedId.toString()
    },
    async removeUser(userId: string) {
        await usersCollection.deleteOne({_id: new ObjectId(userId)})
        return
    },
    async removeComment(commentId: string) {
        await commentsCollection.deleteOne({_id: new ObjectId(commentId)});
        return
    },
    async removeAllData() {
        await usersCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await blogsCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        return
    },
    async createPost(newPost: TypePost) {
        const createdPost = await postsCollection.insertOne(newPost);
        return createdPost.insertedId.toString()
    },
    async createBlog(blog: TypeBlog) {
        const newBlog = await blogsCollection.insertOne(blog);
        return newBlog.insertedId.toString()
    },
    async createComment( newComment: TypeComment) {
        const createdComment = await commentsCollection.insertOne(newComment);
        return createdComment.insertedId.toString()
    },
    async updateBlog(id: string, newBlog: TypeBlogInputModel): Promise<void> {
        await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name: newBlog.name,
                    description: newBlog.description,
                    websiteUrl: newBlog.websiteUrl
                }
            });
        return
    },
    async removeBlog(id: string): Promise<void> {
        await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return
    },
    async updatePost(id: string, newPost: TypePostInputModel): Promise<void> {
        await postsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    content: newPost.content,
                    blogId: newPost.blogId
                }
            });
        return
    },
    async removePost(id: string): Promise<void> {
        await postsCollection.deleteOne({_id: new ObjectId(id)});
        return
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