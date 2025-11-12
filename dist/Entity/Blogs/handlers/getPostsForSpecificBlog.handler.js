"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export async function getPostsForSpecificBlogHandler(req:Request,res:Response) {
//     const blogId = req.params.blogId;
//     const blog = await queryRepo.findBlogByIdOrFail(blogId);
//     //если блог не существует, то 404
//     if(!blog){
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     //вроде нашел место где ошибка была, из-за которой я не сдал дз
//     //проблема в сортировке монго и сортБай и сортДирекшн
//     const query:Partial<IPAginationAndSorting<PostsSortFields>> = req.query;
//     //может все исправится щас, если я сделаю partial
//     const filter:IPAginationAndSorting<PostsSortFields> = setPaginationAndSortingFilter<PostsSortFields>(query);
//     const posts = await queryRepo.findAllPostsForBlog(blogId, filter);
//     res.status(httpStatus.Ok).send(posts);
//
// }
