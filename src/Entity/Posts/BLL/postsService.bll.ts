import {TypePost, TypePostInputModel} from "../Post.types";
import {query} from "express-validator";
import {QueryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {PostsRepository} from "../../../core/dataAcsessLayer/repository/postsRepository.repository";
import {inject, injectable} from "inversify";

// export const postsService = {
//     async  createPost(dto: TypePostInputModel){
//         const blog = await queryRepo.findBlogByIdOrFail(dto.blogId);
//         const newPost:TypePost = {
//             title: dto.title,
//             shortDescription: dto.shortDescription,
//             content: dto.shortDescription,
//             blogId: dto.blogId,
//             blogName: blog!.name,
//             createdAt: blog!.createdAt
//         }
//         const createdId = await postsRepository.createPost(newPost);
//         return createdId
//     },
//     async updatePost(postId: string,dto: TypePostInputModel){
//         await postsRepository.updatePost(postId, dto);
//         return
//     },
//     async removePost(postId: string){
//      await postsRepository.removePost(postId);
//      return
//     }
// }

@injectable()
export class PostsService {
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(QueryRepo) protected queryRepo: QueryRepo){}
    async  createPost(dto: TypePostInputModel){
        const blog = await this.queryRepo.findBlogByIdOrFail(dto.blogId);
        const newPost:TypePost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.shortDescription,
            blogId: dto.blogId,
            blogName: blog!.name,
            createdAt: blog!.createdAt
        }
        const createdId = await this.postsRepository.createPost(newPost);
        return createdId
    }
    async updatePost(postId: string,dto: TypePostInputModel){
        await this.postsRepository.updatePost(postId, dto);
        return
    }
    async removePost(postId: string){
        await this.postsRepository.removePost(postId);
        return
    }
}

