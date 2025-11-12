"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
// export async function createPostForSpecificBlogHandler(req:Request,res:Response) {
//     const blog = await queryRepo.findBlogByIdOrFail(req.params.blogId);
//     //здесь отрабатывается 404
//     if(!blog){
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     const  createdPostId = await blogsService.createPostForSpecificBlog(req.params.blogId, req.body);
//     const post = await queryRepo.findPostByIdOrFail(createdPostId);
//     //доп проверка
//     if(!post){
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     res.status(httpStatus.Created).send(post)
// }
//400 делается в валидации
//401 при авторизации
//остается 404 и 201
