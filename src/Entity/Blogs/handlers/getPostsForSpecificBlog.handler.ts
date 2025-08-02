import {Request,Response} from "express";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getPostsForSpecificBlogHandler(req:Request,res:Response) {
    const blogId = req.params.blogId;
    const blog = await queryRepo.findBlogByIdOrFail(blogId);
    if(!blog){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    const filter = setPaginationAndSortingFilter(req.query);
    const posts = await queryRepo.findAllPostsForBlog(blogId, filter);
    res.status(httpStatus.Ok).send(posts);

}