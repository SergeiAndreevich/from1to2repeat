import {Request,Response} from "express";
import {paginationAndSortingDefault} from "../../../core/pagination/pagination-and-sorting.types";
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";

export async function findCommentForPostHandler(req:Request,res:Response) {
    const filter = setPaginationAndSortingFilter(req.query);
    const postId = req.query.postId;
    //не знаю, как найти коммент по постАйДи
    //даже придумать не могу, где используется постАйДи
}