"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRepo = void 0;
const mongoDB_db_1 = require("../db/mongoDB.db");
const mongodb_1 = require("mongodb");
const mapUserToView_mapper_1 = require("../mappers/mapUserToView.mapper");
const ResultObject_type_1 = require("../types/ResultObject.type");
const mapBlogToView_mapper_1 = require("../mappers/mapBlogToView.mapper");
const bcrypt_helper_1 = require("../helpers/bcrypt.helper");
const mapPostToView_mapper_1 = require("../mappers/mapPostToView.mapper");
const mapCommentToView_mapper_1 = require("../mappers/mapCommentToView.mapper");
const mapSessionsToView_mapper_1 = require("../mappers/mapSessionsToView.mapper");
const inversify_1 = require("inversify");
//не забудь потом вернуться к пагинации и поправить типы. Как в валидации, так и в приходящей dto
// export const queryRepo = {
//     async findUserByIdOrFail(userId:string):Promise<TypeUserViewModel| null>{
//         const user = await usersCollection.findOne({_id: new ObjectId(userId)})
//         if(!user){
//             return null
//         }
//         return mapUserToView(user)
//     },
//     async findUserByAuthOrFail(loginOrEmail:string, password: string):Promise<IResult<TypeUserViewModel | null>>{
//         const user = await usersCollection.findOne({
//             $or: [
//                 { "accountData.login": loginOrEmail },
//                 { "accountData.email": loginOrEmail }
//             ]
//         });
//         if(!user){
//             return {data: null, status: ResultStatuses.unauthorized}
//         }
//         const isPasswordCorrect = await bcryptHelper.isPasswordCorrect(password, user.accountData.password);
//         if(!isPasswordCorrect){
//             return{data: null, status: ResultStatuses.unauthorized}
//         }
//         return {data: mapUserToView(user), status: ResultStatuses.success}
//     },
//     async findBlogByIdOrFail(blogId:string):Promise<TypeBlogViewModel | null> {
//         const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)});
//         if(!blog){
//             return null
//         }
//         return mapBlogToView(blog);
//     },
//     async findPostByIdOrFail(postId: string){
//       const post = await  postsCollection.findOne({_id: new ObjectId(postId)});
//       if(!post){
//           return null
//       }
//       return mapPostToView(post)
//     },
//     async findCommentByIdOrFail(commentId:string):Promise<TypeCommentViewModel | null>{
//         const  comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
//         if (!comment){
//             return null
//         }
//         return mapCommentToView(comment)
//     },
//     async findAllUsersByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypeUserViewModel[]>>{
//         const {
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection,
//             searchLoginTerm,
//             searchEmailTerm
//         } = dto;
//         const skip = (pageNumber - 1) * pageSize;
//         // const filter: any = {};
//         // if (searchLoginTerm) {
//         //     filter.login = { $regex: searchLoginTerm, $options: 'i' };
//         // }
//         // if (searchEmailTerm) {
//         //     filter.email = { $regex: searchEmailTerm, $options: 'i' };
//         // }
//         const andFilters = [];
//
//         if (searchLoginTerm) {
//             andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
//         }
//
//         if (searchEmailTerm) {
//             andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
//         }
//
//         const filter = andFilters.length > 0 ? { $or: andFilters } : {};
//         const items = await usersCollection
//             .find(filter)
//             .sort({ [sortBy]: sortDirection })
//             .skip(skip)
//             .limit(pageSize)
//             .toArray();
//         const totalCount = await usersCollection.countDocuments(filter);
//         const usersToView = {
//             pagesCount: Math.ceil(totalCount / pageSize),
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map((item: WithId<TypeUserExtended>) => mapUserToView(item))
//         }
//         return usersToView
//     },
//     async findAllBlogsByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypeBlogViewModel[]>>{
//         const {
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection,
//             searchNameTerm
//         } = dto;
//         const skip = (pageNumber-1)*(pageSize);
//         const filter:any = {}
//         if(searchNameTerm) {
//             filter.name = { $regex: searchNameTerm, $options: 'i' };
//         }
//         const items = await blogsCollection
//             .find(filter)
//             .sort({ [sortBy]: sortDirection })
//             .skip(skip)
//             .limit(pageSize)
//             .toArray();
//         const totalCount = await blogsCollection.countDocuments(filter);
//         const blogsToView:TypePaginatorObject<TypeBlogViewModel[]> = {
//             pagesCount: Math.ceil(totalCount/pageSize),
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map((item:WithId<TypeBlog>)=> mapBlogToView(item))
//         }
//         return blogsToView
//     },
//     async findAllPostsForBlog(blogId:string,query:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypePostViewModel[]>>{
//         const {
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection
//         } = query;
//         const skip = (pageNumber - 1)*pageSize;
//         const filter: any = {blogId: blogId};
//         const items = await postsCollection
//             .find(filter)
//             .sort({ [sortBy]: sortDirection, _id:sortDirection})
//             .skip(skip)
//             .limit(pageSize)
//             .toArray();
//         const totalCount = await postsCollection.countDocuments(filter);
//         const postsToView: TypePaginatorObject<TypePostViewModel[]> = {
//             pagesCount: Math.ceil(totalCount/pageSize),
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map((item:WithId<TypePost>)=> mapPostToView(item))
//         }
//         return postsToView
//     },
//     async findAllPostsByFilter(dto:IPAginationAndSorting<PostsSortFields>):Promise<TypePaginatorObject<TypePostViewModel[]>>{
//         const {
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection
//         } = dto;
//         const skip = (pageNumber - 1) * pageSize;
//         const filter: any = {};
//         const items = await postsCollection
//             .find(filter)
//             .sort({ [sortBy]: sortDirection })
//             .skip(skip)
//             .limit(pageSize)
//             .toArray();
//         const totalCount = await postsCollection.countDocuments(filter);
//         const postsToView: TypePaginatorObject<TypePostViewModel[]> = {
//             pagesCount: Math.ceil(totalCount/pageSize),
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map((item:WithId<TypePost>)=> mapPostToView(item))
//         }
//         return postsToView
//     },
//     async findCommentsByPostIdOrFail(dto:IPAginationAndSorting<string>, postId:string){
//         const {
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection
//         } = dto;
//         const skip = (pageNumber - 1) * pageSize;
//         const filter: any = {postId: postId};
//         const items = await commentsCollection
//             .find(filter)
//             .sort({ [sortBy]: sortDirection })
//             .skip(skip)
//             .limit(pageSize)
//             .toArray();
//         const totalCount = await commentsCollection.countDocuments(filter);
//         if(totalCount === 0){
//             return null
//         }
//         const commentsToView: TypePaginatorObject<TypeCommentViewModel[]> = {
//             pagesCount: Math.ceil(totalCount/pageSize),
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map((item:WithId<TypeComment>)=> mapCommentToView(item))
//         }
//         return commentsToView
//     },
//     async checkEmailConfirmation(email:string){
//         //нашли юзера по email
//         const user = await usersCollection.findOne({"accountData.email": email});
//         if(!user) {
//             return null
//         }
//         //если почта уже подтверждена, то никакого resendingConfirmationCode и не требуется
//         if(user.emailConfirmation.isConfirmed) {
//             return null
//         }
//         return mapUserToView(user).email
//     },
//     async findSessionByDevice(deviceId:string):Promise<TypeSessionToViewModel | null>{
//         const session = await authCollection.findOne({deviceId: deviceId, revoked: false});
//         if(!session) {
//             return null
//         }
//         return mapSessionToView(session);
//
//     },
//     async findSession(deviceId:string):Promise<TypeSessionToViewModel&{userId:string} | null>{
//         const session = await authCollection.findOne({deviceId: deviceId, revoked: false});
//         if(!session) {
//             return null
//         }
//         const viewModel=  mapSessionToView(session);
//         return {...viewModel,userId:session.userId}
//
//     }
// }
let QueryRepo = class QueryRepo {
    async findUserByIdOrFail(userId) {
        const user = await mongoDB_db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (!user) {
            return null;
        }
        return (0, mapUserToView_mapper_1.mapUserToView)(user);
    }
    async findUserByAuthOrFail(loginOrEmail, password) {
        const user = await mongoDB_db_1.usersCollection.findOne({
            $or: [
                { "accountData.login": loginOrEmail },
                { "accountData.email": loginOrEmail }
            ]
        });
        if (!user) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        const isPasswordCorrect = await bcrypt_helper_1.bcryptHelper.isPasswordCorrect(password, user.accountData.password);
        if (!isPasswordCorrect) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized };
        }
        return { data: (0, mapUserToView_mapper_1.mapUserToView)(user), status: ResultObject_type_1.ResultStatuses.success };
    }
    async findBlogByIdOrFail(blogId) {
        const blog = await mongoDB_db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(blogId) });
        if (!blog) {
            return null;
        }
        return (0, mapBlogToView_mapper_1.mapBlogToView)(blog);
    }
    async findPostByIdOrFail(postId) {
        const post = await mongoDB_db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(postId) });
        if (!post) {
            return null;
        }
        return (0, mapPostToView_mapper_1.mapPostToView)(post);
    }
    async findCommentByIdOrFail(commentId) {
        const comment = await mongoDB_db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(commentId) });
        if (!comment) {
            return null;
        }
        return (0, mapCommentToView_mapper_1.mapCommentToView)(comment);
    }
    async findAllUsersByFilter(dto) {
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = dto;
        const skip = (pageNumber - 1) * pageSize;
        // const filter: any = {};
        // if (searchLoginTerm) {
        //     filter.login = { $regex: searchLoginTerm, $options: 'i' };
        // }
        // if (searchEmailTerm) {
        //     filter.email = { $regex: searchEmailTerm, $options: 'i' };
        // }
        const andFilters = [];
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }
        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await mongoDB_db_1.usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await mongoDB_db_1.usersCollection.countDocuments(filter);
        const usersToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, mapUserToView_mapper_1.mapUserToView)(item))
        };
        return usersToView;
    }
    async findAllBlogsByFilter(dto) {
        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;
        const skip = (pageNumber - 1) * (pageSize);
        const filter = {};
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }
        const items = await mongoDB_db_1.blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await mongoDB_db_1.blogsCollection.countDocuments(filter);
        const blogsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, mapBlogToView_mapper_1.mapBlogToView)(item))
        };
        return blogsToView;
    }
    async findAllPostsForBlog(blogId, query) {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const skip = (pageNumber - 1) * pageSize;
        const filter = { blogId: blogId };
        const items = await mongoDB_db_1.postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection, _id: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await mongoDB_db_1.postsCollection.countDocuments(filter);
        const postsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, mapPostToView_mapper_1.mapPostToView)(item))
        };
        return postsToView;
    }
    async findAllPostsByFilter(dto) {
        const { pageNumber, pageSize, sortBy, sortDirection } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const filter = {};
        const items = await mongoDB_db_1.postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await mongoDB_db_1.postsCollection.countDocuments(filter);
        const postsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, mapPostToView_mapper_1.mapPostToView)(item))
        };
        return postsToView;
    }
    async findCommentsByPostIdOrFail(dto, postId) {
        const { pageNumber, pageSize, sortBy, sortDirection } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const filter = { postId: postId };
        const items = await mongoDB_db_1.commentsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await mongoDB_db_1.commentsCollection.countDocuments(filter);
        if (totalCount === 0) {
            return null;
        }
        const commentsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, mapCommentToView_mapper_1.mapCommentToView)(item))
        };
        return commentsToView;
    }
    async checkEmailConfirmation(email) {
        //нашли юзера по email
        const user = await mongoDB_db_1.usersCollection.findOne({ "accountData.email": email });
        if (!user) {
            return null;
        }
        //если почта уже подтверждена, то никакого resendingConfirmationCode и не требуется
        if (user.emailConfirmation.isConfirmed) {
            return null;
        }
        return (0, mapUserToView_mapper_1.mapUserToView)(user).email;
    }
    async findSessionByDevice(deviceId) {
        const session = await mongoDB_db_1.authCollection.findOne({ deviceId: deviceId, revoked: false });
        if (!session) {
            return null;
        }
        return (0, mapSessionsToView_mapper_1.mapSessionToView)(session);
    }
    async findSession(deviceId) {
        const session = await mongoDB_db_1.authCollection.findOne({ deviceId: deviceId, revoked: false });
        if (!session) {
            return null;
        }
        const viewModel = (0, mapSessionsToView_mapper_1.mapSessionToView)(session);
        return { ...viewModel, userId: session.userId };
    }
};
exports.QueryRepo = QueryRepo;
exports.QueryRepo = QueryRepo = __decorate([
    (0, inversify_1.injectable)()
], QueryRepo);
