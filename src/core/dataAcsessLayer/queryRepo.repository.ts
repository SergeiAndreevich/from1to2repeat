import {IPAginationAndSorting} from "../pagination/pagination-and-sorting.types";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/mongoDB.db";
import {ObjectId, WithId} from "mongodb";
import {TypeUser, TypeUserViewModel} from "../../Entity/Users/User.types";
import {mapUserToView} from "../mappers/mapUserToView.mapper";
import {IResult, ResultStatuses} from "../types/ResultObject.type";
import {TypePaginatorObject} from "../types/paginatorObject.type";
import {TypeBlog, TypeBlogViewModel} from "../../Entity/Blogs/Blog.types";
import {mapBlogToView} from "../mappers/mapBlogToView.mapper";
import {bcryptHelper} from "../helpers/bcrypt.helper";
import {TypeMeViewModel} from "../auth/auth.types";
import {mapMeToView} from "../mappers/mapMeToView.mapper";
import {mapPostToView} from "../mappers/mapPostToView.mapper";
import {TypeCommentViewModel} from "../../Entity/Comments/Comment.types";
import {mapCommentToView} from "../mappers/mapCommentToView.mapper";
import {TypePost, TypePostViewModel} from "../../Entity/Posts/Post.types";

//не забудь потом вернуться к пагинации и поправить типы. Как в валидации, так и в приходящей dto

export const queryRepo = {
    async findUserByIdOrFail(userId:string):Promise<IResult<TypeUserViewModel| null>>{
        const result = await usersCollection.findOne({_id: new ObjectId(userId)})
        if(!result){
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: mapUserToView(result), status: ResultStatuses.success}
    },
    async findUserByAuthOrFail(loginOrEmail:string, password: string):Promise<IResult<TypeUserViewModel | null>>{
        const user = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
        if(!user){
            return {data: null, status: ResultStatuses.notFound}
        }
        const isPasswordCorrect = await bcryptHelper.isPasswordCorrect(password, user.password);
        if(!isPasswordCorrect){
            return{data: null, status: ResultStatuses.unauthorized}
        }
        return {data: mapUserToView(user), status: ResultStatuses.success}
    },
    async findUserById(userId:string):Promise<TypeMeViewModel | null> {
        const user = await usersCollection.findOne({});
        if(!user){
            return null
        }
        return mapMeToView(user)
    },
    async findBlogByIdOrFail(blogId:string):Promise<TypeBlogViewModel | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)});
        if(!blog){
            return null
        }
        return mapBlogToView(blog);
    },
    async findPostByIdOrFail(postId: string){
      const post = await  postsCollection.findOne({_id: new ObjectId(postId)});
      if(!post){
          return null
      }
      return mapPostToView(post)
    },
    async findCommentByIdOrFail(commentId:string):Promise<TypeCommentViewModel | null>{
        const  comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
        if (!comment){
            return null
        }
        return mapCommentToView(comment)
    },
    async findAllUsersByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypeUserViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
        const skip = (+pageNumber - 1) * +pageSize;
        const filter: any = {};

        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' };
        }
        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }

        const items = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await usersCollection.countDocuments(filter);
        const usersToView = {
            pagesCount: Math.ceil(+totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items.map((item: WithId<TypeUser>) => mapUserToView(item))
        }
        return usersToView
    },
    async findAllBlogsByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypeBlogViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        } = dto;
        const skip = (+pageNumber-1)*(+pageSize);
        const filter:any = {}
        if(searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }
        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray();
        const totalCount = await blogsCollection.countDocuments(filter);
        const blogsToView:TypePaginatorObject<TypeBlogViewModel[]> = {
            pagesCount: Math.ceil(+totalCount/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypeBlog>)=> mapBlogToView(item))
        }
        return blogsToView
    },
    async findAllPostsForBlog(blogId:string,query:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypePostViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchEmailTerm,
            searchLoginTerm
        } = query;
        const skip = (+pageNumber - 1) * +pageSize;
        const filter: any = {blogId: blogId};
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }
        if(searchLoginTerm){
            filter.login = {$regex: searchLoginTerm, $options: 'i'}
        }
        if(searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }
        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray();
        const totalCount = await usersCollection.countDocuments(filter);
        const postsToView: TypePaginatorObject<TypePostViewModel[]> = {
            pagesCount: Math.ceil(+totalCount/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypePost>)=> mapPostToView(item))
        }
        return postsToView
    },
    async findAllPostsByFilter(dto:IPAginationAndSorting<string>):Promise<TypePaginatorObject<TypePostViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchEmailTerm,
            searchLoginTerm
        } = dto;
        const skip = (+pageNumber - 1) * +pageSize;
        const filter: any = {};
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }
        if(searchLoginTerm){
            filter.login = {$regex: searchLoginTerm, $options: 'i'}
        }
        if(searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }
        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray();
        const totalCount = await usersCollection.countDocuments(filter);
        const postsToView: TypePaginatorObject<TypePostViewModel[]> = {
            pagesCount: Math.ceil(+totalCount/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items.map((item:WithId<TypePost>)=> mapPostToView(item))
        }
        return postsToView
    }
}