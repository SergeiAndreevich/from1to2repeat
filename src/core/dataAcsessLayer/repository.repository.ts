import {IResult, ResultStatuses} from "../types/ResultObject.type";
import {usersCollection} from "../db/mongoDB.db";
import {TypeUser} from "../../Entity/Users/User.types";
import {ObjectId} from "mongodb";

export const repository = {
    async findUserByLoginOrFail(userLogin:string):Promise<IResult<string | null>>{
        const user = await usersCollection.findOne({login: userLogin});
        if(user === null){
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    },
    async findUserByEmailOrFail(userEmail:string):Promise<IResult<string | null>>{
        const user = await  usersCollection.findOne({email: userEmail});
        if(user === null){
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    },
    async createUser(newUser:TypeUser){
        const createdUser = await usersCollection.insertOne(newUser);
        return createdUser.insertedId.toString()
    },
    async removeUser(userId: string){
        await usersCollection.deleteOne({_id: new ObjectId(userId)})
        return
    }
}