import {Request,Response} from "express";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {blogsService} from "../BLL/blogsService.bll";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function updateBlogHandler(req:Request, res: Response) {
    const blogId = req.params.blogId;
    const blog = await queryRepo.findBlogByIdOrFail(blogId);
    if(!blog) {
        res.sendStatus(httpStatus.NotFound);
        return
    }
    await blogsService.updateBlog(blogId, req.body)
    res.sendStatus(httpStatus.NoContent)
}