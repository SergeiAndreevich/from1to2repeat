import {Request,Response} from "express";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {PostsSortFields} from "../../../core/pagination/pagination-and-sorting.types";

export async function getPostsForSpecificBlogHandler(req:Request,res:Response) {
    const blogId = req.params.blogId;
    const blog = await queryRepo.findBlogByIdOrFail(blogId);
    if(!blog){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    //вроде нашел место где ошибка была, из-за которой я не сдал дз
    //проблема в сортировке монго и сортБай и сортДирекшн
    const filter = setPaginationAndSortingFilter<PostsSortFields>(req.query);
    const posts = await queryRepo.findAllPostsForBlog(blogId, filter);
    res.status(httpStatus.Ok).send(posts);

}