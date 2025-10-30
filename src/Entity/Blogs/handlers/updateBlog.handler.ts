import {Request,Response} from "express";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {blogsService} from "../BLL/blogsService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

// export async function updateBlogHandler(req:Request, res: Response) {
//     const blogId = req.params.id;
//     const blog = await queryRepo.findBlogByIdOrFail(blogId);
//     //отработали 404
//     if(!blog) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     await blogsService.updateBlog(blogId, req.body)
//     //отработали 204
//     res.sendStatus(httpStatus.NoContent)
// }

//401 в авторизации
//400 в валидации
//остается 204 и 404