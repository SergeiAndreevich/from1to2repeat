import {Request,Response} from "express";
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";
import {BlogsSortFields, IPAginationAndSorting} from "../../../core/pagination/pagination-and-sorting.types";

// export async function getAllBlogsHandler(req:Request,res:Response){
//     //получаем из query входящие параметры пагинации, закидываем их в функцию (что-то пришло, что-то дефолтное)
//     //тк нам может ничего не прийти, то разумеет правильнее сделать все поля необязательными, ведь
//     //дефолтные значения мы присваиваем только потом
//     const query:Partial<IPAginationAndSorting<BlogsSortFields>> = req.query;
//     const filter = setPaginationAndSortingFilter<BlogsSortFields>(query);
//     const blogsList = await queryRepo.findAllBlogsByFilter(filter);
//     res.status(httpStatus.Ok).send(blogsList)
// }