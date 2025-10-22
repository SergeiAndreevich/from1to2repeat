import {TypeUser, TypeUserExtended, TypeUserInputModel} from "../User.types";
import {bcryptHelper} from "../../../core/helpers/bcrypt.helper";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {IResult, ResultStatuses} from "../../../core/types/ResultObject.type";
import {usersCollection} from "../../../core/db/mongoDB.db";
import {usersRepository} from "../../../core/dataAcsessLayer/repository/usersRepository.repository";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import {nodemailerHelper} from "../../../core/helpers/nodemailer.helper";
import {TypeMyError} from "../../../core/errors/validationErrorResult.handler";

export const SALT_ROUNDS = 10;
type TypeTestExportData ={
    id: string;
    code: string;
}

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

class UsersService {
    async createUser(userInput: TypeUserInputModel): Promise<IResult<TypeTestExportData | null>> {
        //проверяем, существует ли уже пользователь с такими login/email
        const userByLogin = await usersRepository.findUserByLoginOrFail(userInput.login);
        const userByEmail = await usersRepository.findUserByEmailOrFail(userInput.email);

        //если есть такой логин ИЛИ email, то возвращаем null и статус
        if( userByLogin.status === ResultStatuses.success) {
            return {data: null, status: ResultStatuses.alreadyExist, errorMessage: {field: 'login', message:'User already exists'}};
        }
        if( userByEmail.status === ResultStatuses.success) {
            return {data: null, status: ResultStatuses.alreadyExist,  errorMessage: {field: 'email', message:'User already exists'}};
        }

        //нельзя хранить открытые пароли, поэтому хэшируем
        const passwordHash = await bcryptHelper.generateHash(userInput.password, SALT_ROUNDS);

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

        const confirmationCode = uuidv4();

        const newUser: TypeUserExtended = {
            accountData: {
                login:userInput.login,
                email: userInput.email,
                password: passwordHash,
                createdAt: new Date()
            },
            emailConfirmation:{
                confirmationCode,
                expirationDate: add(new Date(),{
                    hours: 1,
                    minutes: 2,
                }),
                isConfirmed: false
            }
        }

        //отправляем в БД, чтобы получить его id
        const createdId:string = await usersRepository.createUser(newUser);

        //отправляем письмо на почту для подтверждения
        const result = await nodemailerHelper.sendConfirmationEmail(newUser.accountData.email, confirmationCode);
        //в result лежат accepted, rejected, messageId, response, etc

        //if(result.accepted.length === 0){problem}
        //потом добавить проверку, если не ушло. или еще какие-то проблемы если

        return {data:{id:createdId, code: confirmationCode}, status:ResultStatuses.success}
    }
    async createUserBySuperAdmin(userInput: TypeUserInputModel): Promise<IResult<string | null>>{
        //проверяем, существует ли уже пользователь с такими login/email
        const userByLogin = await usersRepository.findUserByLoginOrFail(userInput.login);
        const userByEmail = await usersRepository.findUserByEmailOrFail(userInput.email);

        //если есть такой логин ИЛИ email, то возвращаем null и статус
        if( userByLogin.status === ResultStatuses.success) {
            return {data: null, status: ResultStatuses.alreadyExist, errorMessage: {field: 'login', message:'User already exists'}};
        }
        if( userByEmail.status === ResultStatuses.success) {
            return {data: null, status: ResultStatuses.alreadyExist,  errorMessage: {field: 'email', message:'User already exists'}};
        }

        //нельзя хранить открытые пароли, поэтому хэшируем
        const passwordHash = await bcryptHelper.generateHash(userInput.password, SALT_ROUNDS);

        const newUser: TypeUserExtended = {
            accountData: {
                login:userInput.login,
                email: userInput.email,
                password: passwordHash,
                createdAt: new Date()
            },
            emailConfirmation:{
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),{
                    hours: 1,
                    minutes: 2,
                }),
                isConfirmed: true
            }
        }

        //отправляем в БД, чтобы получить его id
        const createdId:string = await usersRepository.createUser(newUser);
        return {data:createdId, status:ResultStatuses.success}

    }
    async confirmUser(code: string): Promise<IResult<string | null>> {
        const result = await usersRepository.confirmEmailByCode(code);
        return {data: result.data, status: result.status, errorMessage: result.errorMessage}
    }
    async updateConfirmationCode(email: string): Promise<void> {
        const code = uuidv4();
        await usersRepository.updateConfirmationCode(email, code);
        const result = await nodemailerHelper.sendConfirmationEmail(email, code);
        return
    }
}

export const usersService = new UsersService()
