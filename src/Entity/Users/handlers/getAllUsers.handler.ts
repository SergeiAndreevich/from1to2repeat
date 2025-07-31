import express, {Request,Response} from 'express';
import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
import {UsersSortFields} from "../../../core/pagination/pagination-and-sorting.types";
import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
import {httpStatus} from "../../../core/types/httpStatuses.type";

export async function getUsersHandler (req:Request, res: Response){
    //есть нюанс с фильтром. Он не типизируется как надо. Точнее я не знаю как его типизировать
    //сейчас там лежит стринг, а я хочу чтобы там динамически формировался тип SortFields
    const filter = setPaginationAndSortingFilter(req.query);
    const usersList = await queryRepo.findAllUsersByFilter(filter);
    res.status(httpStatus.Ok).send(usersList)
}