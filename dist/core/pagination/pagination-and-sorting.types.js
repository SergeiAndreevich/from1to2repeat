"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsSortFields = exports.UsersSortFields = exports.PostsSortFields = exports.BlogsSortFields = exports.paginationAndSortingDefault = void 0;
// потом на место дженерика Т будут приходить **SortFields в зависимости от того, какой ednpoint
//ДЕФОЛТНЫЕ ЗНАЧЕНИЯ ПАГИНАЦИИ И СОРТИРОВКИ
exports.paginationAndSortingDefault = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: "desc" /* SortDirection.DESC */
};
var BlogsSortFields;
(function (BlogsSortFields) {
    BlogsSortFields["createdAt"] = "createdAt";
})(BlogsSortFields || (exports.BlogsSortFields = BlogsSortFields = {}));
var PostsSortFields;
(function (PostsSortFields) {
    PostsSortFields["createdAt"] = "createdAt";
})(PostsSortFields || (exports.PostsSortFields = PostsSortFields = {}));
var UsersSortFields;
(function (UsersSortFields) {
    UsersSortFields["createdAt"] = "createdAt";
})(UsersSortFields || (exports.UsersSortFields = UsersSortFields = {}));
var CommentsSortFields;
(function (CommentsSortFields) {
    CommentsSortFields["createdAt"] = "createdAt";
})(CommentsSortFields || (exports.CommentsSortFields = CommentsSortFields = {}));
