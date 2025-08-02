"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPaginationValidation = queryPaginationValidation;
const pagination_and_sorting_types_1 = require("../pagination/pagination-and-sorting.types");
const express_validator_1 = require("express-validator");
function queryPaginationValidation(sortFields) {
    return [
        (0, express_validator_1.query)('pageNumber')
            .optional()
            .default(pagination_and_sorting_types_1.paginationAndSortingDefault.pageNumber)
            .isInt({ min: 1 })
            .withMessage('pageNumber must be a number')
            .toInt(),
        (0, express_validator_1.query)('pageSize')
            .optional()
            .default(pagination_and_sorting_types_1.paginationAndSortingDefault.pageSize)
            .isInt({ min: 1 })
            .withMessage('pageSize must be a number')
            .toInt(),
        (0, express_validator_1.query)('sortBy')
            .optional()
            .default(Object.values(sortFields)[0])
            .isIn(Object.values(sortFields))
            .withMessage(`Allowed sort fields: ${Object.values(sortFields).join(', ')}`),
        (0, express_validator_1.query)('sortDirection')
            .optional()
            .default(pagination_and_sorting_types_1.paginationAndSortingDefault.sortDirection)
            .isIn(Object.values(pagination_and_sorting_types_1.paginationAndSortingDefault.sortDirection))
            .withMessage(`Allowed sort fields: ${Object.values(pagination_and_sorting_types_1.paginationAndSortingDefault.sortDirection).join(', ')}`),
        //думал написать сразу сюда все SearchSmthTerm, но понял, что могу их проверить только на то
        //являются ли они строкой и все. Значит писать сюда их не имеет смысла
    ];
}
