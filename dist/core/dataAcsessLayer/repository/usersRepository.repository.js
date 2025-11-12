"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = exports.UsersRepository = void 0;
const ResultObject_type_1 = require("../../types/ResultObject.type");
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
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
let UsersRepository = class UsersRepository {
    async findUserByLoginOrFail(userLogin) {
        const user = await mongoDB_db_1.usersCollection.findOne({ "accountData.login": userLogin });
        if (!user) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
        }
        return { data: user._id.toString(), status: ResultObject_type_1.ResultStatuses.success };
    }
    async findUserByEmailOrFail(userEmail) {
        const user = await mongoDB_db_1.usersCollection.findOne({ "accountData.email": userEmail });
        if (!user) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
        }
        return { data: user._id.toString(), status: ResultObject_type_1.ResultStatuses.success };
    }
    async createUser(newUser) {
        const createdUser = await mongoDB_db_1.usersCollection.insertOne(newUser);
        return createdUser.insertedId.toString();
    }
    async removeUser(userId) {
        await mongoDB_db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
        return;
    }
    async confirmEmailByCode(code) {
        //ищем юзера по коду. Если нет - не найден
        const user = await mongoDB_db_1.usersCollection.findOne({
            "emailConfirmation.confirmationCode": code
        });
        if (!user) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.notFound, errorMessage: { field: 'code', message: 'code not found' } };
        }
        //ищем юзера по коду и сроку истечения кода - истек? Неавторизован
        if (user.emailConfirmation.expirationDate < new Date()) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.unauthorized, errorMessage: { field: 'code', message: 'code expired' } };
        }
        //проверяем, чтобы почта не была уже подтвержденной
        if (user.emailConfirmation.isConfirmed) {
            //изначально я поле ошибки я написал email и из-за этого тест падал
            return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'code', message: 'email already exists and is confirmed' } };
        }
        //обновляем данные для юзера, если все четко
        await mongoDB_db_1.usersCollection.updateOne({ _id: user._id }, { $set: { "emailConfirmation.isConfirmed": true } });
        return { data: null, status: ResultObject_type_1.ResultStatuses.success };
    }
    async updateConfirmationCode(email, code) {
        //обновляем данные для юзера
        await mongoDB_db_1.usersCollection.updateOne({ "accountData.email": email }, { $set: { "emailConfirmation.confirmationCode": code } });
        return;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
exports.usersRepository = new UsersRepository();
