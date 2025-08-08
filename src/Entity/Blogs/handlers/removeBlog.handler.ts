import {Request, Response} from 'express';
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {blogsService} from "../BLL/blogsService.bll";

export async function removeBlogHandler(req:Request, res: Response) {
    const blogId = req.params.id;
    const blog = await queryRepo.findBlogByIdOrFail(blogId);
    //тут отработали 404
    if(!blog) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await blogsService.removeBlog(blogId);
    //а здесь 204
    res.sendStatus(httpStatus.NoContent)
}

//401 в авторизации
//остается 404 и 204