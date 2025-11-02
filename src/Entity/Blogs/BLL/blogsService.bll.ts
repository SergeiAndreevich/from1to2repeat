import {TypeBlogPostInputModel, TypePost} from "../../Posts/Post.types";
import {QueryRepo, queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {TypeBlog, TypeBlogInputModel} from "../Blog.types";
import {PostsRepository, postsRepository} from "../../../core/dataAcsessLayer/repository/postsRepository.repository";
import {BlogsRepository, blogsRepository} from "../../../core/dataAcsessLayer/repository/blogsRepository.repository";

// export const blogsService = {
//     async createPostForSpecificBlog(blogId: string, dto: TypeBlogPostInputModel) {
//         const blog = await queryRepo.findBlogByIdOrFail(blogId);
//         const newPost:TypePost = {
//             title: dto.title,
//             shortDescription: dto.shortDescription,
//             content: dto.content,
//             blogId: blogId,
//             blogName: blog!.name,
//             createdAt: blog!.createdAt
//         }
//         const createdPostId = await postsRepository.createPost(newPost);
//         return createdPostId
//     },
//     async createBlog(dto:TypeBlogInputModel){
//             const newBlog: TypeBlog = {
//                 name: dto.name,
//                 description: dto.description,
//                 websiteUrl: dto.websiteUrl,
//                 createdAt: new Date(),
//                 isMembership: false
//             }
//             const createdBlogId = await blogsRepository.createBlog(newBlog);
//             return createdBlogId
//     },
//     async updateBlog(blogId: string, dto: TypeBlogInputModel) {
//         return await blogsRepository.updateBlog(blogId, dto)
//     },
//     async removeBlog(blogId: string){
//         await blogsRepository.removeBlog(blogId);
//         return
//
//     }
// }

export class BlogsService {
    private queryRepo: QueryRepo;
    private postsRepository: PostsRepository;
    private blogsRepository: BlogsRepository;
    constructor() {
        this.queryRepo = new QueryRepo();
        this.postsRepository = new PostsRepository();
        this.blogsRepository = new BlogsRepository();
    }

    async createPostForSpecificBlog(blogId: string, dto: TypeBlogPostInputModel) {
        const blog = await this.queryRepo.findBlogByIdOrFail(blogId);
        const newPost:TypePost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: blog!.createdAt
        }
        const createdPostId = await this.postsRepository.createPost(newPost);
        return createdPostId
    }
    async createBlog(dto:TypeBlogInputModel){
        const newBlog: TypeBlog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        const createdBlogId = await this.blogsRepository.createBlog(newBlog);
        return createdBlogId
    }
    async updateBlog(blogId: string, dto: TypeBlogInputModel) {
        return await this.blogsRepository.updateBlog(blogId, dto)
    }
    async removeBlog(blogId: string){
        await this.blogsRepository.removeBlog(blogId);
        return

    }
}

export const blogsService = new BlogsService();
