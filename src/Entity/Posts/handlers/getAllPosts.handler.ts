import {Request, Response} from 'express';
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {flushCompileCache} from "node:module";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getAllPostsHandler(req:Request, res:Response) {
    const filter = setPaginationAndSortingFilter(req.query);
    const postsList = await queryRepo.findAllPostsByFilter(filter);
    res.status(httpStatus.Ok).send(postsList)
}