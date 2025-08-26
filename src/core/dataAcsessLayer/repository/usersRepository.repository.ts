import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {usersCollection} from "../../db/mongoDB.db";
import {TypeUser, TypeUserExtended} from "../../../Entity/Users/User.types";
import {ObjectId} from "mongodb";
import {usersService} from "../../../Entity/Users/BLL/usersService.bll";

export const usersRepository = {
    async findUserByLoginOrFail(userLogin: string): Promise<IResult<string | null>> {
        const user = await usersCollection.findOne({login: userLogin});
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    },
    async findUserByEmailOrFail(userEmail: string): Promise<IResult<string | null>> {
        const user = await usersCollection.findOne({email: userEmail});
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    },
    async createUser(newUser: TypeUserExtended) {
        const createdUser = await usersCollection.insertOne(newUser);
        return createdUser.insertedId.toString()
    },
    async removeUser(userId: string) {
        await usersCollection.deleteOne({_id: new ObjectId(userId)})
        return
    },
    async confirmEmailByCode(code:string){
        //ищем юзера по коду. Если нет - не найден
        const user = await usersCollection.findOne({
            "emailConfirmation.confirmationCode": code
        })
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        //ищем юзера по коду и сроку истечения кода - истек? Неавторизован
        const actualUser = await usersCollection.findOne({
            "emailConfirmation.confirmationCode": code,
            "emailConfirmation.expirationDate": { $gt: new Date() }
        })
        if (!actualUser) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        //проверяем, чтобы почта не была уже подтвержденной
        const confirmedUser = await usersCollection.findOne({
            "emailConfirmation.confirmationCode": code,
            "emailConfirmation.expirationDate": { $gt: new Date()},
            "emailConfirmation.isConfirmed": true
        })
        if (confirmedUser) {
            return {data: null, status: ResultStatuses.alreadyExist}
        }

        //обновляем данные для юзера, если все четко
        await usersCollection.updateOne(  {
                "emailConfirmation.confirmationCode": code,
                "emailConfirmation.expirationDate": { $gt: new Date() }
            },
            {
                $set: { "emailConfirmation.isConfirmed": true }
            })
        return  {data: null, status: ResultStatuses.success}
    }
}