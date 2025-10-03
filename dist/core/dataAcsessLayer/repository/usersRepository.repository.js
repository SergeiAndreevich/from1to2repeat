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
exports.usersRepository = void 0;
const ResultObject_type_1 = require("../../types/ResultObject.type");
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mongodb_1 = require("mongodb");
exports.usersRepository = {
    findUserByLoginOrFail(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDB_db_1.usersCollection.findOne({ "accountData.login": userLogin });
            if (!user) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            return { data: user._id.toString(), status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    findUserByEmailOrFail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDB_db_1.usersCollection.findOne({ "accountData.email": userEmail });
            if (!user) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            return { data: user._id.toString(), status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield mongoDB_db_1.usersCollection.insertOne(newUser);
            return createdUser.insertedId.toString();
        });
    },
    removeUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
            return;
        });
    },
    confirmEmailByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            //ищем юзера по коду. Если нет - не найден
            const user = yield mongoDB_db_1.usersCollection.findOne({
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
            yield mongoDB_db_1.usersCollection.updateOne({ _id: user._id }, { $set: { "emailConfirmation.isConfirmed": true } });
            return { data: null, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    updateConfirmationCode(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            //обновляем данные для юзера
            yield mongoDB_db_1.usersCollection.updateOne({ "accountData.email": email }, { $set: { "emailConfirmation.confirmationCode": code } });
            return;
        });
    }
};
