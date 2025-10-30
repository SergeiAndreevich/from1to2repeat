import {IPAginationAndSorting, PostsSortFields} from "../pagination/pagination-and-sorting.types";
import {authCollection, blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/mongoDB.db";
import {ObjectId, WithId} from "mongodb";
import {TypeUser, TypeUserExtended, TypeUserViewModel} from "../../Entity/Users/User.types";
import {mapUserToView} from "../mappers/mapUserToView.mapper";
import {IResult, ResultStatuses} from "../types/ResultObject.type";
import {TypePaginatorObject} from "../types/paginatorObject.type";
import {TypeBlog, TypeBlogViewModel} from "../../Entity/Blogs/Blog.types";
import {mapBlogToView} from "../mappers/mapBlogToView.mapper";
import {bcryptHelper} from "../helpers/bcrypt.helper";
import {TypeMeViewModel, TypeSessionToViewModel} from "../auth/auth.types";
import {mapMeToView} from "../mappers/mapMeToView.mapper";
import {mapPostToView} from "../mappers/mapPostToView.mapper";
import {TypeComment, TypeCommentViewModel} from "../../Entity/Comments/Comment.types";
import {mapCommentToView} from "../mappers/mapCommentToView.mapper";
import {TypePost, TypePostViewModel} from "../../Entity/Posts/Post.types";
import {mapSessionToView} from "../mappers/mapSessionsToView.mapper";

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

export class QueryRepo {
    async findUserByIdOrFail(userId:string):Promise<TypeUserViewModel| null>{
        const user = await usersCollection.findOne({_id: new ObjectId(userId)})
        if(!user){
            return null
        }
        return mapUserToView(user)
    }
    async findUserByAuthOrFail(loginOrEmail:string, password: string):Promise<IResult<TypeUserViewModel | null>>{
        const user = await usersCollection.findOne({
            $or: [
                { "accountData.login": loginOrEmail },
                { "accountData.email": loginOrEmail }
            ]
        });
        if(!user){
            return {data: null, status: ResultStatuses.unauthorized}
        }
        const isPasswordCorrect = await bcryptHelper.isPasswordCorrect(password, user.accountData.password);
        if(!isPasswordCorrect){
            return{data: null, status: ResultStatuses.unauthorized}
        }
        return {data: mapUserToView(user), status: ResultStatuses.success}
    }
    async findBlogByIdOrFail(blogId:string):Promise<TypeBlogViewModel | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)});
        if(!blog){
            return null
        }
        return mapBlogToView(blog);
    }
    async findPostByIdOrFail(postId: string){
        const post = await  postsCollection.findOne({_id: new ObjectId(postId)});
        if(!post){
            return null
        }
        return mapPostToView(post)
    }
    async findCommentByIdOrFail(commentId:string):Promise<TypeCommentViewModel | null>{
        const  comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
        if (!comment){
            return null
        }
        return mapCommentToView(comment)
    }
    async findAllUsersByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypeUserViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
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
        const items = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await usersCollection.countDocuments(filter);
        const usersToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item: WithId<TypeUserExtended>) => mapUserToView(item))
        }
        return usersToView
    }
    async findAllBlogsByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypeBlogViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        } = dto;
        const skip = (pageNumber-1)*(pageSize);
        const filter:any = {}
        if(searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }
        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await blogsCollection.countDocuments(filter);
        const blogsToView:TypePaginatorObject<TypeBlogViewModel[]> = {
            pagesCount: Math.ceil(totalCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypeBlog>)=> mapBlogToView(item))
        }
        return blogsToView
    }
    async findAllPostsForBlog(blogId:string,query:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypePostViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = query;
        const skip = (pageNumber - 1)*pageSize;
        const filter: any = {blogId: blogId};
        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection, _id:sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await postsCollection.countDocuments(filter);
        const postsToView: TypePaginatorObject<TypePostViewModel[]> = {
            pagesCount: Math.ceil(totalCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypePost>)=> mapPostToView(item))
        }
        return postsToView
    }
    async findAllPostsByFilter(dto:IPAginationAndSorting<PostsSortFields>):Promise<TypePaginatorObject<TypePostViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};
        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await postsCollection.countDocuments(filter);
        const postsToView: TypePaginatorObject<TypePostViewModel[]> = {
            pagesCount: Math.ceil(totalCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypePost>)=> mapPostToView(item))
        }
        return postsToView
    }
    async findCommentsByPostIdOrFail(dto:IPAginationAndSorting<string>, postId:string){
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {postId: postId};
        const items = await commentsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await commentsCollection.countDocuments(filter);
        if(totalCount === 0){
            return null
        }
        const commentsToView: TypePaginatorObject<TypeCommentViewModel[]> = {
            pagesCount: Math.ceil(totalCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypeComment>)=> mapCommentToView(item))
        }
        return commentsToView
    }
    async checkEmailConfirmation(email:string){
        //нашли юзера по email
        const user = await usersCollection.findOne({"accountData.email": email});
        if(!user) {
            return null
        }
        //если почта уже подтверждена, то никакого resendingConfirmationCode и не требуется
        if(user.emailConfirmation.isConfirmed) {
            return null
        }
        return mapUserToView(user).email
    }
    async findSessionByDevice(deviceId:string):Promise<TypeSessionToViewModel | null>{
        const session = await authCollection.findOne({deviceId: deviceId, revoked: false});
        if(!session) {
            return null
        }
        return mapSessionToView(session);

    }
    async findSession(deviceId:string):Promise<TypeSessionToViewModel&{userId:string} | null>{
        const session = await authCollection.findOne({deviceId: deviceId, revoked: false});
        if(!session) {
            return null
        }
        const viewModel=  mapSessionToView(session);
        return {...viewModel,userId:session.userId}

    }
}

export const queryRepo = new QueryRepo()