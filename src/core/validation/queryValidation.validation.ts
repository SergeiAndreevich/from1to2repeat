import {paginationAndSortingDefault, SortDirection} from "../pagination/pagination-and-sorting.types";
import {query} from "express-validator";

export function queryPaginationValidation<T extends string>(sortFields: Record<string, T>) {
    return [
        query('pageNumber')
            .optional()
            .isString()
            .default(paginationAndSortingDefault.pageNumber)
            .isInt({min: 1})
            .withMessage('pageNumber must be a number')
            .toInt(),
        query('pageSize')
            .optional()
            .isString()
            .default(paginationAndSortingDefault.pageSize)
            .isInt({min: 1})
            .withMessage('pageSize must be a number')
            .toInt(),
        query('sortBy')
            .optional()
            .isString()
            .default(Object.values(sortFields)[0])
            .isIn(Object.values(sortFields))
            .withMessage(`Allowed sort fields: ${Object.values(sortFields).join(', ')}`),
        query('sortDirection')
            .optional()
            .isString()
            .default(paginationAndSortingDefault.sortDirection)
            .isIn(Object.values(SortDirection))
            .withMessage(`Allowed sort fields: ${Object.values(paginationAndSortingDefault.sortDirection).join(', ')}`),
        //думал написать сразу сюда все SearchSmthTerm, но понял, что могу их проверить только на то
        //являются ли они строкой и все. Значит писать сюда их не имеет смысла
    ]
}
