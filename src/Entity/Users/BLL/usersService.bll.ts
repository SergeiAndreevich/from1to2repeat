import {TypeUser, TypeUserInputModel} from "../User.types";
import {bcryptHelper} from "../../../core/helpers/bcrypt.helper";
import {repository} from "../../../core/dataAcsessLayer/repository.repository";
import {IResult, ResultStatuses} from "../../../core/types/ResultObject.type";
import {usersCollection} from "../../../core/db/mongoDB.db";
import {usersRepository} from "../../../core/dataAcsessLayer/repository/usersRepository.repository";

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
        const newUser: TypeUser = {
            login:userInput.login,
            email: userInput.email,
            password: passwordHash,
            createdAt: new Date()
        }

        //отправляем в БД, чтобы получить его id
        const createdId:string = await usersRepository.createUser(newUser);
        return {data:createdId, status:ResultStatuses.success};
    },
    async confirmUser(code: string): Promise<IResult> {
        return {data: null, status: ResultStatuses.alreadyExist}
    }
}