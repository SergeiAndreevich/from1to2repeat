// import express, {Request,Response} from 'express';
// import {setPaginationAndSortingFilter} from "../../../core/pagination/pagination-and-sorting.helper";
// import {IPAginationAndSorting, UsersSortFields} from "../../../core/pagination/pagination-and-sorting.types";
// import {queryRepo} from "../../../core/dataAcsessLayer/queryRepo.repository";
// import {httpStatus} from "../../../core/types/httpStatuses.type";
//
// export async function getUsersHandler (req:Request, res: Response){
//     //есть нюанс с фильтром. Он не типизируется как надо. Точнее я не знаю как его типизировать
//     //сейчас там лежит стринг, а я хочу чтобы там динамически формировался тип SortFields
//
//
//     //так хз че я писал выше. Сейчас уже пишу по другому вопросу
//     const query:Partial<IPAginationAndSorting<UsersSortFields>> = req.query;
//     console.log('usersQuery',query);
//     const filter = setPaginationAndSortingFilter<UsersSortFields>(query);
//     const usersList = await queryRepo.findAllUsersByFilter(filter);
//     res.status(httpStatus.Ok).send(usersList)
// }
//
// //задействованы 200 и 401
// //401 отработала в авторизации