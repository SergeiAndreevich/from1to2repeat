"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export async function removeBlogHandler(req:Request, res: Response) {
//     const blogId = req.params.id;
//     const blog = await queryRepo.findBlogByIdOrFail(blogId);
//     //тут отработали 404
//     if(!blog) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     await blogsService.removeBlog(blogId);
//     //а здесь 204
//     res.sendStatus(httpStatus.NoContent)
// }
//401 в авторизации
//остается 404 и 204
