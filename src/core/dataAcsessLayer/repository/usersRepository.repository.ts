import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {usersCollection} from "../../db/mongoDB.db";
import {TypeUser, TypeUserExtended} from "../../../Entity/Users/User.types";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

// export const usersRepository = {
//     async findUserByLoginOrFail(userLogin: string): Promise<IResult<string | null>> {
//         const user = await usersCollection.findOne({"accountData.login": userLogin});
//         if (!user) {
//             return {data: null, status: ResultStatuses.notFound}
//         }
//         return {data: user._id.toString(), status: ResultStatuses.success}
//     },
//     async findUserByEmailOrFail(userEmail: string): Promise<IResult<string | null>> {
//         const user = await usersCollection.findOne({"accountData.email": userEmail});
//         if (!user) {
//             return {data: null, status: ResultStatuses.notFound}
//         }
//         return {data: user._id.toString(), status: ResultStatuses.success}
//     },
//     async createUser(newUser: TypeUserExtended) {
//         const createdUser = await usersCollection.insertOne(newUser);
//         return createdUser.insertedId.toString()
//     },
//     async removeUser(userId: string) {
//         await usersCollection.deleteOne({_id: new ObjectId(userId)})
//         return
//     },
//     async confirmEmailByCode(code:string):Promise<IResult<string | null>> {
//         //ищем юзера по коду. Если нет - не найден
//         const user = await usersCollection.findOne({
//             "emailConfirmation.confirmationCode": code
//         })
//         if (!user) {
//             return {data: null, status: ResultStatuses.notFound, errorMessage: {field: 'code', message: 'code not found'}};
//         }
//
//         //ищем юзера по коду и сроку истечения кода - истек? Неавторизован
//         if (user.emailConfirmation.expirationDate < new Date()){
//             return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'code', message: 'code expired'}}
//         }
//
//         //проверяем, чтобы почта не была уже подтвержденной
//         if (user.emailConfirmation.isConfirmed){
//             //изначально я поле ошибки я написал email и из-за этого тест падал
//             return {data: null, status: ResultStatuses.alreadyExist, errorMessage: {field: 'code', message: 'email already exists and is confirmed'}};
//         }
//
//         //обновляем данные для юзера, если все четко
//         await usersCollection.updateOne(
//             { _id: user._id },
//             { $set: { "emailConfirmation.isConfirmed": true }}
//         )
//         return  {data: null, status: ResultStatuses.success}
//     },
//     async updateConfirmationCode(email: string, code:string): Promise<void> {
//         //обновляем данные для юзера
//         await usersCollection.updateOne(
//             { "accountData.email": email },
//             { $set: { "emailConfirmation.confirmationCode": code }}
//         )
//         return
//     }
// }
@injectable()
export class UsersRepository {
    async findUserByLoginOrFail(userLogin: string): Promise<IResult<string | null>> {
        const user = await usersCollection.findOne({"accountData.login": userLogin});
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    }
    async findUserByEmailOrFail(userEmail: string): Promise<IResult<string | null>> {
        const user = await usersCollection.findOne({"accountData.email": userEmail});
        if (!user) {
            return {data: null, status: ResultStatuses.notFound}
        }
        return {data: user._id.toString(), status: ResultStatuses.success}
    }
    async createUser(newUser: TypeUserExtended) {
        const createdUser = await usersCollection.insertOne(newUser);
        return createdUser.insertedId.toString()
    }
    async removeUser(userId: string) {
        await usersCollection.deleteOne({_id: new ObjectId(userId)})
        return
    }
    async confirmEmailByCode(code:string):Promise<IResult<string | null>> {
        //ищем юзера по коду. Если нет - не найден
        const user = await usersCollection.findOne({
            "emailConfirmation.confirmationCode": code
        })
        if (!user) {
            return {data: null, status: ResultStatuses.notFound, errorMessage: {field: 'code', message: 'code not found'}};
        }

        //ищем юзера по коду и сроку истечения кода - истек? Неавторизован
        if (user.emailConfirmation.expirationDate < new Date()){
            return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'code', message: 'code expired'}}
        }

        //проверяем, чтобы почта не была уже подтвержденной
        if (user.emailConfirmation.isConfirmed){
            //изначально я поле ошибки я написал email и из-за этого тест падал
            return {data: null, status: ResultStatuses.alreadyExist, errorMessage: {field: 'code', message: 'email already exists and is confirmed'}};
        }

        //обновляем данные для юзера, если все четко
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { "emailConfirmation.isConfirmed": true }}
        )
        return  {data: null, status: ResultStatuses.success}
    }
    async updateConfirmationCode(email: string, code:string): Promise<void> {
        //обновляем данные для юзера
        await usersCollection.updateOne(
            { "accountData.email": email },
            { $set: { "emailConfirmation.confirmationCode": code }}
        )
        return
    }
}
export const usersRepository = new UsersRepository();