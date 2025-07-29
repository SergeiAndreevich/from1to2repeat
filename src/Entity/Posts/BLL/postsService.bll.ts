import {TypePost, TypePostInputModel} from "../Post.types";
import {query} from "express-validator";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";

export const postsService = {
    async  createPost(dto: TypePostInputModel){
        const blog = await queryRepo.findBlogByIdOrFail(dto.blogId);
        const newPost:TypePost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.shortDescription,
            blogId: dto.blogId,
            blogName: blog!.name,
            createdAt: blog!.createdAt
        }
        const createdId = await repository.createPost(newPost);
        return createdId
    },
    async updatePost(postId: string,dto: TypePostInputModel){
        await repository.updatePost(postId, dto);
        return
    },
    async removePost(postId: string){
     await repository.removePost(postId);
     return
    }
}