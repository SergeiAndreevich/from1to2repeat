export interface IPAginationAndSorting<T> {
    pageNumber: number,
    pageSize: number,
    sortBy: T,
    sortDirection: SortDirection,
    searchNameTerm?: string,
    searchLoginTerm?: string,
    searchEmailTerm?: string
}
// потом на место дженерика Т будут приходить **SortFields в зависимости от того, какой ednpoint


export enum SortDirection {
    DESC = 'desc',
    ASC = 'asc',
}
//ДЕФОЛТНЫЕ ЗНАЧЕНИЯ ПАГИНАЦИИ И СОРТИРОВКИ
export const paginationAndSortingDefault:IPAginationAndSorting<string> = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: SortDirection.DESC
}

export enum BlogsSortFields {
    createdAt = 'createdAt'
}

export enum PostsSortFields {
    createdAt = 'createdAt'
}

export enum UsersSortFields {
    createdAt = 'createdAt',
    login = 'login'
}

export enum CommentsSortFields {
    createdAt = 'createdAt'
}