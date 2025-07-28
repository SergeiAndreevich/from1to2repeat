import {Request, Response} from 'express';
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getBlogByIdHandler(req: Request, res: Response) {
    const  blogId = req.params.id;
    const blog = await queryRepo.findBlogByIdOrFail(blogId);
    if(!blog) {
        res.sendStatus(httpStatus.NotFound)
        return
    }
    res.status(httpStatus.Ok).send(blog);
}