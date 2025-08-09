import {Request,Response} from "express";
import {
    CommentsSortFields,
    IPAginationAndSorting,
    paginationAndSortingDefault
} from "../../../core/pagination/pagination-and-sorting.types";
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function findCommentForPostHandler(req:Request,res:Response) {
    const query :Partial<IPAginationAndSorting<CommentsSortFields>> = req.query;
    const filter = setPaginationAndSortingFilter(query);
    const postId = req.params.postId;
    const post = await queryRepo.findPostByIdOrFail(postId);
    if(!post){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    const commentList = await queryRepo.findCommentsByPostIdOrFail(filter, postId);
    if(!commentList){
        res.sendStatus(httpStatus.NotFound);
        return
    }
    res.status(httpStatus.Ok).send(commentList)
}