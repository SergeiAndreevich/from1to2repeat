import {TypePost, TypePostInputModel} from "../../../Entity/Posts/Post.types";
import {postsCollection} from "../../db/mongoDB.db";
import {ObjectId} from "mongodb";

// export const postsRepository = {
//     async createPost(newPost: TypePost) {
//         const createdPost = await postsCollection.insertOne(newPost);
//         return createdPost.insertedId.toString()
//     },
//     async updatePost(id: string, newPost: TypePostInputModel): Promise<void> {
//         await postsCollection.updateOne({_id: new ObjectId(id)},
//             {
//                 $set: {
//                     title: newPost.title,
//                     shortDescription: newPost.shortDescription,
//                     content: newPost.content,
//                     blogId: newPost.blogId
//                 }
//             });
//         return
//     },
//     async removePost(id: string): Promise<void> {
//         await postsCollection.deleteOne({_id: new ObjectId(id)});
//         return
//     },
// }

export class PostsRepository {
    async createPost(newPost: TypePost) {
        const createdPost = await postsCollection.insertOne(newPost);
        return createdPost.insertedId.toString()
    }
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
    }
    async removePost(id: string): Promise<void> {
        await postsCollection.deleteOne({_id: new ObjectId(id)});
        return
    }
}

export const postsRepository = new PostsRepository();