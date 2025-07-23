import {IPAginationAndSorting} from "../pagination/pagination-and-sorting.types";
import {usersCollection} from "../db/mongoDB.db";
import {WithId} from "mongodb";
import {TypeUser} from "../../Entity/Users/User.types";
import {mapUserToView} from "../mappers/mapUserToView.mapper";

export const queryRepo = {
    async getAllUsersByFilter(dto:IPAginationAndSorting<any>){
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
    }
}