import {
    BlogsSortFields, CommentsSortFields,
    IPAginationAndSorting,
    paginationAndSortingDefault, PostsSortFields,
    SortDirection, UsersSortFields
} from "./pagination-and-sorting.types";

export function setPaginationAndSortingFilter <T = string>(queryDto:Partial<IPAginationAndSorting<T>>): IPAginationAndSorting<T>{
    //обрати внимание, здесь используются унарные плюсы. Нужно ли это?
    const filter = {
        pageNumber: queryDto.pageNumber ?  queryDto.pageNumber : paginationAndSortingDefault.pageNumber,
        pageSize: queryDto.pageSize ?queryDto.pageSize : paginationAndSortingDefault.pageSize,
        sortBy: queryDto.sortBy ? queryDto.sortBy as T : paginationAndSortingDefault.sortBy as T,
        sortDirection: queryDto.sortDirection ? queryDto.sortDirection as SortDirection : paginationAndSortingDefault.sortDirection as SortDirection,
        searchNameTerm: queryDto?.searchNameTerm,
        searchLoginTerm: queryDto?.searchLoginTerm,
        searchEmailTerm: queryDto?.searchEmailTerm
    }
    return filter
}

//здесь комментарий чисто себе напомнить: в другом проекте ты делал 3 разных таких функции в зависимости от места
//то есть для юзеров одни searchTerms, для блогов другие, для постов третьи
//здесь же я решил объединить все в одно. Верное ли это решение? ХЗ