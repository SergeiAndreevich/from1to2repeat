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
                return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'login', message: 'User already exists' } };
            }
            if (userByEmail.status === ResultObject_type_1.ResultStatuses.success) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'email', message: 'User already exists' } };
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
            // const confirmationCode = process.env.NODE_ENV === "test"
            //     ? "your_confirmation_code"
            //     : uuidv4();
            const confirmationCode = (0, uuid_1.v4)();
            const newUser = {
                accountData: {
                    login: userInput.login,
                    email: userInput.email,
                    password: passwordHash,
                    createdAt: new Date()
                },
                emailConfirmation: {
                    confirmationCode,
                    expirationDate: (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 2,
                    }),
                    isConfirmed: false
                }
            };
            //отправляем в БД, чтобы получить его id
            const createdId = yield usersRepository_repository_1.usersRepository.createUser(newUser);
            //отправляем письмо на почту для подтверждения
            const result = yield nodemailer_helper_1.nodemailerHelper.sendConfirmationEmail(newUser.accountData.email, confirmationCode);
            //в result лежат accepted, rejected, messageId, response, etc
            //if(result.accepted.length === 0){problem}
            //потом добавить проверку, если не ушло. или еще какие-то проблемы если
            return { data: { id: createdId, code: confirmationCode }, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    createUserBySuperAdmin(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверяем, существует ли уже пользователь с такими login/email
            const userByLogin = yield usersRepository_repository_1.usersRepository.findUserByLoginOrFail(userInput.login);
            const userByEmail = yield usersRepository_repository_1.usersRepository.findUserByEmailOrFail(userInput.email);
            //если есть такой логин ИЛИ email, то возвращаем null и статус
            if (userByLogin.status === ResultObject_type_1.ResultStatuses.success) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'login', message: 'User already exists' } };
            }
            if (userByEmail.status === ResultObject_type_1.ResultStatuses.success) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'email', message: 'User already exists' } };
            }
            //нельзя хранить открытые пароли, поэтому хэшируем
            const passwordHash = yield bcrypt_helper_1.bcryptHelper.gerenateHash(userInput.password, exports.SALT_ROUNDS);
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
                    isConfirmed: true
                }
            };
            //отправляем в БД, чтобы получить его id
            const createdId = yield usersRepository_repository_1.usersRepository.createUser(newUser);
            return { data: createdId, status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    confirmUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield usersRepository_repository_1.usersRepository.confirmEmailByCode(code);
            return { data: result.data, status: result.status, errorMessage: result.errorMessage };
        });
    },
    updateConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = (0, uuid_1.v4)();
            yield usersRepository_repository_1.usersRepository.updateConfirmationCode(email, code);
            const result = yield nodemailer_helper_1.nodemailerHelper.sendConfirmationEmail(email, code);
            return;
        });
    }
};
