import {Request,Response} from "express";
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getAllBlogsHandler(req:Request,res:Response){
    //получаем из query входящие параметры пагинации, закидываем их в функцию (что-то пришло, что-то дефолтное)
    const filter = setPaginationAndSortingFilter(req.query);
    const blogsList = await queryRepo.findAllBlogsByFilter(filter);
    res.status(httpStatus.Ok).send(blogsList)
}