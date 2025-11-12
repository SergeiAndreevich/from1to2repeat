"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
//
// export const blogsRepository = {
//     async createBlog(blog: TypeBlog) {
//         const newBlog = await blogsCollection.insertOne(blog);
//         return newBlog.insertedId.toString()
//     },
//     async updateBlog(id: string, newBlog: TypeBlogInputModel): Promise<void> {
//         await blogsCollection.updateOne({_id: new ObjectId(id)},
//             {
//                 $set: {
//                     name: newBlog.name,
//                     description: newBlog.description,
//                     websiteUrl: newBlog.websiteUrl
//                 }
//             });
//         return
//     },
//     async removeBlog(id: string): Promise<void> {
//         await blogsCollection.deleteOne({_id: new ObjectId(id)});
//         return
//     },
// }
let BlogsRepository = class BlogsRepository {
    async createBlog(blog) {
        const newBlog = await mongoDB_db_1.blogsCollection.insertOne(blog);
        return newBlog.insertedId.toString();
    }
    async updateBlog(id, newBlog) {
        await mongoDB_db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl
            }
        });
        return;
    }
    async removeBlog(id) {
        await mongoDB_db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return;
    }
};
exports.BlogsRepository = BlogsRepository;
exports.BlogsRepository = BlogsRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsRepository);
