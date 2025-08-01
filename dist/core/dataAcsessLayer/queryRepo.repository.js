"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryRepo = void 0;
const mongoDB_db_1 = require("../db/mongoDB.db");
const mongodb_1 = require("mongodb");
const mapUserToView_mapper_1 = require("../mappers/mapUserToView.mapper");
const ResultObject_type_1 = require("../types/ResultObject.type");
const mapBlogToView_mapper_1 = require("../mappers/mapBlogToView.mapper");
const bcrypt_helper_1 = require("../helpers/bcrypt.helper");
const mapMeToView_mapper_1 = require("../mappers/mapMeToView.mapper");
const mapPostToView_mapper_1 = require("../mappers/mapPostToView.mapper");
const mapCommentToView_mapper_1 = require("../mappers/mapCommentToView.mapper");
//не забудь потом вернуться к пагинации и поправить типы. Как в валидации, так и в приходящей dto
exports.queryRepo = {
    findUserByIdOrFail(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDB_db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
            if (!result) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            return { data: (0, mapUserToView_mapper_1.mapUserToView)(result), status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    findUserByAuthOrFail(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDB_db_1.usersCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
            if (!user) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            const isPasswordCorrect = yield bcrypt_helper_1.bcryptHelper.isPasswordCorrect(password, user.password);
            if (!isPasswordCorrect) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
            }
            return { data: (0, mapUserToView_mapper_1.mapUserToView)(user), status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDB_db_1.usersCollection.findOne({});
            if (!user) {
                return null;
            }
            return (0, mapMeToView_mapper_1.mapMeToView)(user);
        });
    },
    findBlogByIdOrFail(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield mongoDB_db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(blogId) });
            if (!blog) {
                return null;
            }
            return (0, mapBlogToView_mapper_1.mapBlogToView)(blog);
        });
    },
    findPostByIdOrFail(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield mongoDB_db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(postId) });
            if (!post) {
                return null;
            }
            return (0, mapPostToView_mapper_1.mapPostToView)(post);
        });
    },
    findCommentByIdOrFail(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield mongoDB_db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(commentId) });
            if (!comment) {
                return null;
            }
            return (0, mapCommentToView_mapper_1.mapCommentToView)(comment);
        });
    },
    findAllUsersByFilter(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = dto;
            const skip = (+pageNumber - 1) * +pageSize;
            const filter = {};
            if (searchLoginTerm) {
                filter.login = { $regex: searchLoginTerm, $options: 'i' };
            }
            if (searchEmailTerm) {
                filter.email = { $regex: searchEmailTerm, $options: 'i' };
            }
            const items = yield mongoDB_db_1.usersCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongoDB_db_1.usersCollection.countDocuments(filter);
            const usersToView = {
                pagesCount: Math.ceil(+totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: items.map((item) => (0, mapUserToView_mapper_1.mapUserToView)(item))
            };
            return usersToView;
        });
    },
    findAllBlogsByFilter(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;
            const skip = (+pageNumber - 1) * (+pageSize);
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            const items = yield mongoDB_db_1.blogsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(+pageSize)
                .toArray();
            const totalCount = yield mongoDB_db_1.blogsCollection.countDocuments(filter);
            const blogsToView = {
                pagesCount: Math.ceil(+totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: items.map((item) => (0, mapBlogToView_mapper_1.mapBlogToView)(item))
            };
            return blogsToView;
        });
    },
    findAllPostsForBlog(blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = query;
            const skip = (pageNumber - 1) * pageSize;
            const filter = { blogId: blogId };
            const items = yield mongoDB_db_1.postsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection, _id: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongoDB_db_1.postsCollection.countDocuments(filter);
            const postsToView = {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: items.map((item) => (0, mapPostToView_mapper_1.mapPostToView)(item))
            };
            return postsToView;
        });
    },
    findAllPostsByFilter(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = dto;
            const skip = (+pageNumber - 1) * +pageSize;
            const filter = {};
            const items = yield mongoDB_db_1.postsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(+pageSize)
                .toArray();
            const totalCount = yield mongoDB_db_1.usersCollection.countDocuments(filter);
            const postsToView = {
                pagesCount: Math.ceil(+totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: items.map((item) => (0, mapPostToView_mapper_1.mapPostToView)(item))
            };
            return postsToView;
        });
    },
    findCommentsByPostIdOrFail(dto, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = dto;
            const skip = (+pageNumber - 1) * +pageSize;
            const filter = { postId: postId };
            const items = yield mongoDB_db_1.commentsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(+pageSize)
                .toArray();
            const totalCount = yield mongoDB_db_1.commentsCollection.countDocuments(filter);
            if (totalCount === 0) {
                return null;
            }
            const commentsToView = {
                pagesCount: Math.ceil(+totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: items.map((item) => (0, mapCommentToView_mapper_1.mapCommentToView)(item))
            };
            return commentsToView;
        });
    }
};
