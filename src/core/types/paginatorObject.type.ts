export type TypePaginatorObject<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}