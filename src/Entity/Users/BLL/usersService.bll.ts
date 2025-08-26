import {TypeUser, TypeUserExtended, TypeUserInputModel} from "../User.types";
import {bcryptHelper} from "../../../core/helpers/bcrypt.helper";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {IResult, ResultStatuses} from "../../../core/types/ResultObject.type";
import {usersCollection} from "../../../core/db/mongoDB.db";
import {usersRepository} from "../../../core/dataAcsessLayer/repository/usersRepository.repository";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import {nodemailerHelper} from "../../../core/helpers/nodemailer.helper";

export const SALT_ROUNDS = 10;

export const usersService = {
    async createUser(userInput: TypeUserInputModel): Promise<IResult<string | null>> {
        //проверяем, существует ли уже пользователь с такими login/email
        const userByLogin = await usersRepository.findUserByLoginOrFail(userInput.login);
        const userByEmail = await usersRepository.findUserByEmailOrFail(userInput.email);
        //если есть такой логин ИЛИ email, то возвращаем null и статус
        if( userByLogin.status === ResultStatuses.success) {
            return {data: null, status: ResultStatuses.alreadyExist}
        }
        if( userByEmail.status === ResultStatuses.success) {
            return {data: null, status: ResultStatuses.alreadyExist}
        }
        //нельзя хранить открытые пароли, поэтому хэшируем
        const passwordHash = await bcryptHelper.gerenateHash(userInput.password, SALT_ROUNDS);

        //создаем нового Юзера
        // const newUser: TypeUser = {
        //     login:userInput.login,
        //     email: userInput.email,
        //     password: passwordHash,
        //     createdAt: new Date()
        // }
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
                isConfirmed: false
            }
        }

        //отправляем в БД, чтобы получить его id
        const createdId:string = await usersRepository.createUser(newUser);
        await nodemailerHelper.sendConfirmationEmail(newUser.accountData.email);
        //потом добавить проверку, если не ушло. или еще какие-то проблемы если
        return {data:createdId, status:ResultStatuses.success}
    },
    async confirmUser(code: string): Promise<IResult> {
        const result = await usersRepository.confirmEmailByCode(code);
        return {data: result.data, status: result.status}
    }
}