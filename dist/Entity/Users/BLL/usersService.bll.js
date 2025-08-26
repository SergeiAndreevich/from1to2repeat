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
const ResultObject_type_1 = require("../../../core/types/ResultObject.type");
const usersRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/usersRepository.repository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const nodemailer_helper_1 = require("../../../core/helpers/nodemailer.helper");
exports.SALT_ROUNDS = 10;
exports.usersService = {
    createUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверяем, существует ли уже пользователь с такими login/email
            const userByLogin = yield usersRepository_repository_1.usersRepository.findUserByLoginOrFail(userInput.login);
            const userByEmail = yield usersRepository_repository_1.usersRepository.findUserByEmailOrFail(userInput.email);
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
            // const newUser: TypeUser = {
            //     login:userInput.login,
            //     email: userInput.email,
            //     password: passwordHash,
            //     createdAt: new Date()
            // }
            const newUser = {
                accountData: {
                    login: userInput.login,
                    email: userInput.email,
                    password: passwordHash,
                    createdAt: new Date()
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 2,
                    }),
                    isConfirmed: false
                }
            };
            //отправляем в БД, чтобы получить его id
            const createdId = yield usersRepository_repository_1.usersRepository.createUser(newUser);
            yield nodemailer_helper_1.nodemailerHelper.sendConfirmationEmail(newUser.accountData.email);
            //потом добавить проверку, если не ушло. или еще какие-то проблемы если
            return { data: createdId, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    confirmUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield usersRepository_repository_1.usersRepository.confirmEmailByCode(code);
            return { data: result.data, status: result.status };
        });
    }
};
