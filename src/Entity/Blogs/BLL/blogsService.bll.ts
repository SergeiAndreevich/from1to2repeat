import {TypeBlogPostInputModel, TypePost} from "../../Posts/Post.types";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {TypeBlog, TypeBlogInputModel} from "../Blog.types";
import {blogsCollection} from "../../../core/db/mongoDB.db";

export const blogsService = {
    async createPostForSpecificBlog(blogId: string, dto: TypeBlogPostInputModel) {
        const blog = await queryRepo.findBlogByIdOrFail(blogId);
        const newPost:TypePost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: blog!.createdAt
        }
        const createdPostId = await repository.createPost(newPost);
        return createdPostId
    },
    async createBlog(dto:TypeBlogInputModel){
            const newBlog: TypeBlog = {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl,
                createdAt: new Date(),
                isMembership: false
            }
            const createdBlogId = await repository.createBlog(newBlog);
            return createdBlogId
    },
    async updateBlog(blogId: string, dto: TypeBlogInputModel) {
        return await repository.updateBlog(blogId, dto)
    },
    async removeBlog(blogId: string){
        await repository.removeBlog(blogId);
        return

    }
}