"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.SALT_ROUNDS = void 0;
const bcrypt_helper_1 = require("../../../core/helpers/bcrypt.helper");
const ResultObject_type_1 = require("../../../core/types/ResultObject.type");
const usersRepository_repository_1 = require("../../../core/dataAcsessLayer/repository/usersRepository.repository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const nodemailer_helper_1 = require("../../../core/helpers/nodemailer.helper");
const inversify_1 = require("inversify");
exports.SALT_ROUNDS = 10;
// export const usersService = {
//     async createUser(userInput: TypeUserInputModel): Promise<IResult<TypeTestExportData | null>> {
//         //проверяем, существует ли уже пользователь с такими login/email
//         const userByLogin = await usersRepository.findUserByLoginOrFail(userInput.login);
//         const userByEmail = await usersRepository.findUserByEmailOrFail(userInput.email);
//
//         //если есть такой логин ИЛИ email, то возвращаем null и статус
//         if( userByLogin.status === ResultStatuses.success) {
//             return {data: null, status: ResultStatuses.alreadyExist, errorMessage: {field: 'login', message:'User already exists'}};
//         }
//         if( userByEmail.status === ResultStatuses.success) {
//             return {data: null, status: ResultStatuses.alreadyExist,  errorMessage: {field: 'email', message:'User already exists'}};
//         }
//
//         //нельзя хранить открытые пароли, поэтому хэшируем
//         const passwordHash = await bcryptHelper.gerenateHash(userInput.password, SALT_ROUNDS);
//
//         //создаем нового Юзера
//         // const newUser: TypeUser = {
//         //     login:userInput.login,
//         //     email: userInput.email,
//         //     password: passwordHash,
//         //     createdAt: new Date()
//         // }
//         // const confirmationCode = process.env.NODE_ENV === "test"
//         //     ? "your_confirmation_code"
//         //     : uuidv4();
//
//         const confirmationCode = uuidv4();
//
//         const newUser: TypeUserExtended = {
//             accountData: {
//                     login:userInput.login,
//                     email: userInput.email,
//                     password: passwordHash,
//                     createdAt: new Date()
//             },
//             emailConfirmation:{
//                 confirmationCode,
//                 expirationDate: add(new Date(),{
//                     hours: 1,
//                     minutes: 2,
//                 }),
//                 isConfirmed: false
//             }
//         }
//
//         //отправляем в БД, чтобы получить его id
//         const createdId:string = await usersRepository.createUser(newUser);
//
//         //отправляем письмо на почту для подтверждения
//         const result = await nodemailerHelper.sendConfirmationEmail(newUser.accountData.email, confirmationCode);
//         //в result лежат accepted, rejected, messageId, response, etc
//
//         //if(result.accepted.length === 0){problem}
//         //потом добавить проверку, если не ушло. или еще какие-то проблемы если
//
//         return {data:{id:createdId, code: confirmationCode}, status:ResultStatuses.success}
//     },
//     async createUserBySuperAdmin(userInput: TypeUserInputModel): Promise<IResult<string | null>>{
//         //проверяем, существует ли уже пользователь с такими login/email
//         const userByLogin = await usersRepository.findUserByLoginOrFail(userInput.login);
//         const userByEmail = await usersRepository.findUserByEmailOrFail(userInput.email);
//
//         //если есть такой логин ИЛИ email, то возвращаем null и статус
//         if( userByLogin.status === ResultStatuses.success) {
//             return {data: null, status: ResultStatuses.alreadyExist, errorMessage: {field: 'login', message:'User already exists'}};
//         }
//         if( userByEmail.status === ResultStatuses.success) {
//             return {data: null, status: ResultStatuses.alreadyExist,  errorMessage: {field: 'email', message:'User already exists'}};
//         }
//
//         //нельзя хранить открытые пароли, поэтому хэшируем
//         const passwordHash = await bcryptHelper.gerenateHash(userInput.password, SALT_ROUNDS);
//
//         const newUser: TypeUserExtended = {
//             accountData: {
//                 login:userInput.login,
//                 email: userInput.email,
//                 password: passwordHash,
//                 createdAt: new Date()
//             },
//             emailConfirmation:{
//                 confirmationCode: uuidv4(),
//                 expirationDate: add(new Date(),{
//                     hours: 1,
//                     minutes: 2,
//                 }),
//                 isConfirmed: true
//             }
//         }
//
//         //отправляем в БД, чтобы получить его id
//         const createdId:string = await usersRepository.createUser(newUser);
//         return {data:createdId, status:ResultStatuses.success}
//
//     },
//     async confirmUser(code: string): Promise<IResult<string | null>> {
//         const result = await usersRepository.confirmEmailByCode(code);
//         return {data: result.data, status: result.status, errorMessage: result.errorMessage}
//     },
//     async updateConfirmationCode(email: string): Promise<void> {
//         const code = uuidv4();
//         await usersRepository.updateConfirmationCode(email, code);
//         const result = await nodemailerHelper.sendConfirmationEmail(email, code);
//         return
//     }
// }
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async createUser(userInput) {
        //проверяем, существует ли уже пользователь с такими login/email
        const userByLogin = await this.usersRepository.findUserByLoginOrFail(userInput.login);
        const userByEmail = await this.usersRepository.findUserByEmailOrFail(userInput.email);
        //если есть такой логин ИЛИ email, то возвращаем null и статус
        if (userByLogin.status === ResultObject_type_1.ResultStatuses.success) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'login', message: 'User already exists' } };
        }
        if (userByEmail.status === ResultObject_type_1.ResultStatuses.success) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'email', message: 'User already exists' } };
        }
        //нельзя хранить открытые пароли, поэтому хэшируем
        const passwordHash = await bcrypt_helper_1.bcryptHelper.generateHash(userInput.password, exports.SALT_ROUNDS);
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
            },
            passwordRecovery: {
                confirmationCode: null,
                expirationDate: new Date(),
                isConfirmed: false
            }
        };
        //отправляем в БД, чтобы получить его id
        const createdId = await this.usersRepository.createUser(newUser);
        //отправляем письмо на почту для подтверждения
        const result = await nodemailer_helper_1.nodemailerHelper.sendConfirmationEmail(newUser.accountData.email, confirmationCode);
        //в result лежат accepted, rejected, messageId, response, etc
        //if(result.accepted.length === 0){problem}
        //потом добавить проверку, если не ушло. или еще какие-то проблемы если
        return { data: { id: createdId, code: confirmationCode }, status: ResultObject_type_1.ResultStatuses.success };
    }
    async createUserBySuperAdmin(userInput) {
        //проверяем, существует ли уже пользователь с такими login/email
        const userByLogin = await this.usersRepository.findUserByLoginOrFail(userInput.login);
        const userByEmail = await this.usersRepository.findUserByEmailOrFail(userInput.email);
        //если есть такой логин ИЛИ email, то возвращаем null и статус
        if (userByLogin.status === ResultObject_type_1.ResultStatuses.success) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'login', message: 'User already exists' } };
        }
        if (userByEmail.status === ResultObject_type_1.ResultStatuses.success) {
            return { data: null, status: ResultObject_type_1.ResultStatuses.alreadyExist, errorMessage: { field: 'email', message: 'User already exists' } };
        }
        //нельзя хранить открытые пароли, поэтому хэшируем
        const passwordHash = await bcrypt_helper_1.bcryptHelper.generateHash(userInput.password, exports.SALT_ROUNDS);
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
            },
            passwordRecovery: {
                confirmationCode: null,
                expirationDate: new Date(),
                isConfirmed: false
            }
        };
        //отправляем в БД, чтобы получить его id
        const createdId = await this.usersRepository.createUser(newUser);
        return { data: createdId, status: ResultObject_type_1.ResultStatuses.success };
    }
    async confirmUser(code) {
        const result = await this.usersRepository.confirmEmailByCode(code);
        return { data: result.data, status: result.status, errorMessage: result.errorMessage };
    }
    async updateConfirmationCode(email) {
        const code = (0, uuid_1.v4)();
        await this.usersRepository.updateConfirmationCode(email, code);
        const result = await nodemailer_helper_1.nodemailerHelper.sendConfirmationEmail(email, code);
        return;
    }
    async removeUser(userId) {
        await this.usersRepository.removeUser(userId);
        return;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersRepository_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [usersRepository_repository_1.UsersRepository])
], UsersService);
