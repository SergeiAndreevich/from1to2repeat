import {TypeBlog, TypeBlogInputModel} from "../../../Entity/Blogs/Blog.types";
import {blogsCollection} from "../../db/mongoDB.db";
import {ObjectId} from "mongodb";

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

class BlogsRepository {
    async createBlog(blog: TypeBlog) {
        const newBlog = await blogsCollection.insertOne(blog);
        return newBlog.insertedId.toString()
    }
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
    }
    async removeBlog(id: string): Promise<void> {
        await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return
    }
}

export const blogsRepository = new BlogsRepository()