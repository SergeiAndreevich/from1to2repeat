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
exports.usersService = exports.SALT_ROUNDS = void 0;
const bcrypt_helper_1 = require("../../../core/helpers/bcrypt.helper");
const repository_repository_1 = require("../../../core/dataAcsessLayer/repository.repository");
const ResultObject_type_1 = require("../../../core/types/ResultObject.type");
exports.SALT_ROUNDS = 10;
exports.usersService = {
    createUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверяем, существует ли уже пользователь с такими login/email
            const userByLogin = yield repository_repository_1.repository.findUserByLoginOrFail(userInput.login);
            const userByEmail = yield repository_repository_1.repository.findUserByEmailOrFail(userInput.email);
            //если есть такой логин ИЛИ email, то возвращаем null и статус
            if (userByLogin.status === ResultObject_type_1.ResultStatuses.success) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist };
            }
            if (userByEmail.status === ResultObject_type_1.ResultStatuses.success) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist };
            }
            //нельзя хранить открытые пароли, поэтому хэшируем
            const passwordHash = yield bcrypt_helper_1.bcryptHelper.gerenateHash(userInput.password, exports.SALT_ROUNDS);
            //создаем нового Юзера
            const newUser = {
                login: userInput.login,
                email: userInput.email,
                password: passwordHash,
                createdAt: new Date()
            };
            //отправляем в БД, чтобы получить его id
            const createdId = yield repository_repository_1.repository.createUser(newUser);
            return { data: createdId, status: ResultObject_type_1.ResultStatuses.success };
        });
    }
};
