"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRepository = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
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
let PostsRepository = class PostsRepository {
    async createPost(newPost) {
        const createdPost = await mongoDB_db_1.postsCollection.insertOne(newPost);
        return createdPost.insertedId.toString();
    }
    async updatePost(id, newPost) {
        await mongoDB_db_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId
            }
        });
        return;
    }
    async removePost(id) {
        await mongoDB_db_1.postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return;
    }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsRepository);
