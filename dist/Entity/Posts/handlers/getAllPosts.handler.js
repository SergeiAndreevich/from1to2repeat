"use strict";
// import {Request, Response} from 'express';
// import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
// import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
// import {flushCompileCache} from "node:module";
// import {httpStatus} from "../../../core/types/httpStatuses.type";
// import {IPAginationAndSorting, PostsSortFields} from "../../../core/pagination/pagination-and-sorting.types";
//
// export async function getAllPostsHandler(req:Request, res:Response) {
//     const query:Partial<IPAginationAndSorting<PostsSortFields>> = req.query;
//     const filter = setPaginationAndSortingFilter<PostsSortFields>(query);
//     const postsList = await queryRepo.findAllPostsByFilter(filter);
//     res.status(httpStatus.Ok).send(postsList)
// }
