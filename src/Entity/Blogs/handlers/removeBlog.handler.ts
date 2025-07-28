import {Request, Response} from 'express';
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {blogsService} from "../BLL/blogsService.bll";

export async function removeBlogHandler(req:Request, res: Response) {
    const blogId = req.params.id;
    const blog = await queryRepo.findBlogByIdOrFail(blogId);
    if(!blog) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await blogsService.removeBlog(blogId);
    res.sendStatus(httpStatus.NoContent)
}