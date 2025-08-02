import {Request, Response} from 'express';
import {blogsService} from "../BLL/blogsService.bll";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";

export async function createPostForSpecificBlogHandler(req:Request,res:Response) {
    const blog = await queryRepo.findBlogByIdOrFail(req.params.blogId);
    if(!blog){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    const  createdPostId = await blogsService.createPostForSpecificBlog(req.params.blogId, req.body);
    const post = await queryRepo.findPostByIdOrFail(createdPostId);
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    res.status(httpStatus.Created).send(post)
}