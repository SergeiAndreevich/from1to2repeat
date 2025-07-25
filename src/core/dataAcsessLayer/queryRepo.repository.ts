import {IPAginationAndSorting} from "../pagination/pagination-and-sorting.types";
import {blogsCollection, usersCollection} from "../db/mongoDB.db";
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
    async findAllUsersByFilter(dto:IPAginationAndSorting<any>):Promise<TypePaginatorObject<TypeUserViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
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
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item: WithId<TypeUser>) => mapUserToView(item))
        }
        return usersToView
    },
    async findAllBlogsByFilter(dto:IPAginationAndSorting<any>):Promise<TypePaginatorObject<TypeBlogViewModel[]>>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        } = dto;
        const skip = (pageNumber-1)*pageSize;
        const filter:any ={};
        if (searchNameTerm) {
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
        return{}
    }
}