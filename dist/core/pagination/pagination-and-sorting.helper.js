"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPaginationAndSortingFilter = setPaginationAndSortingFilter;
const pagination_and_sorting_types_1 = require("./pagination-and-sorting.types");
function setPaginationAndSortingFilter(queryDto) {
    //обрати внимание, здесь используются унарные плюсы. Нужно ли это? (Нужно. Ты в дефолт прописал числами, а из квери приходит строка)
    const filter = {
        pageNumber: Number(queryDto.pageNumber) || pagination_and_sorting_types_1.paginationAndSortingDefault.pageNumber,
        pageSize: Number(queryDto.pageSize) || pagination_and_sorting_types_1.paginationAndSortingDefault.pageSize,
        sortBy: queryDto.sortBy ? queryDto.sortBy : pagination_and_sorting_types_1.paginationAndSortingDefault.sortBy,
        sortDirection: queryDto.sortDirection ? queryDto.sortDirection : pagination_and_sorting_types_1.paginationAndSortingDefault.sortDirection,
        searchNameTerm: queryDto === null || queryDto === void 0 ? void 0 : queryDto.searchNameTerm,
        searchLoginTerm: queryDto === null || queryDto === void 0 ? void 0 : queryDto.searchLoginTerm,
        searchEmailTerm: queryDto === null || queryDto === void 0 ? void 0 : queryDto.searchEmailTerm
    };
    return filter;
}
//здесь комментарий чисто себе напомнить: в другом проекте ты делал 3 разных таких функции в зависимости от места
//то есть для юзеров одни searchTerms, для блогов другие, для постов третьи
//здесь же я решил объединить все в одно. Верное ли это решение? ХЗ
