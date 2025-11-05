import {Request, Response} from "express";
import {httpStatus} from "../core/types/httpStatuses.type";
import {QueryRepo, queryRepo} from "../core/dataAcsessLayer/queryRepo.repository";
import {TypeMeViewModel} from "../core/auth/handlers/whoAmI.handler";
import {inject, injectable} from "inversify";
import {AuthService, authService} from "../core/auth/BLL/authService.bll";
import {ResultStatuses} from "../core/types/ResultObject.type";
import {createErrorsMessages} from "../core/errors/createErrorsMessage.function";
import {TypeUserInputModel} from "../Entity/Users/User.types";
import {UsersService} from "../Entity/Users/BLL/usersService.bll";

@injectable()
export class AuthController {
    constructor(@inject(QueryRepo) protected queryRepo: QueryRepo,
                @inject(AuthService) protected authService: AuthService,
                @inject(UsersService) protected usersService: UsersService) {}
    async whoAmIHandler(req:Request, res:Response):Promise<void | TypeMeViewModel>{
        const userId = req.userId;
        if(userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatus.Unauthorized)
            return
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        if(!user){
            res.sendStatus(httpStatus.ExtraError)
            return
        }
        res.status(httpStatus.Ok).send({email:user?.email,login:user?.login,userId:user?.id})
    }
    async authHandler(req:Request, res:Response){
        const ip = req.ip;
        if(!ip){
            res.sendStatus(httpStatus.Forbidden);
            return
        }
        const deviceName = req.headers['user-agent']  || 'Unknown device';
        //проверяем, есть ли такой юзер. Если есть и все данные сходятся - выдаем токены
        const result = await this.authService.checkUserInfo(req.body, {ip, deviceName});
        switch (result.status) {
            case ResultStatuses.notFound:
                res.sendStatus(httpStatus.NotFound);
                break
            case ResultStatuses.unauthorized:
                res.sendStatus(httpStatus.Unauthorized);
                break
            case ResultStatuses.success:
                res.cookie("refreshToken", result.data!.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 20 * 1000 // 20 secund в ms
                });
                res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken});
                break
            default:
                res.sendStatus(httpStatus.InternalServerError)
                break
        }

    }
    async registrationConfirmationHandler(req:Request, res:Response) {
        const { code } = req.body; // ✅ достаём строку
        //console.log('🔍 Confirmation attempt with code:', code, typeof code);

        //204 если код подходит
        const result = await this.usersService.confirmUser(code);
        //console.log('🔍 Confirmation result:', result.status);

        if(result.status === ResultStatuses.unauthorized) {
            //console.log('❌ Code expired');
            res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
            return
        }
        if(result.status === ResultStatuses.notFound) {
            //console.log('❌ Code not found');
            res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
            return
        }
        if(result.status === ResultStatuses.alreadyExist) {
            //console.log('❌ Already confirmed');
            res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
            return
        }
        //console.log('✅ Email confirmed successfully');
        res.sendStatus(httpStatus.NoContent)
        //400 если код не подходит, истек или уже был применен
    }
    async registrationHandler(req: Request, res: Response): Promise<void> {
        const userInput:TypeUserInputModel = req.body;
        //передаем их в БЛЛ и просим создать юзера, результатом создания является id
        const newUserResult = await this.usersService.createUser(userInput);
        //результат работы по созданию юзера
        if(newUserResult.status === ResultStatuses.alreadyExist){
            res.status(httpStatus.BadRequest).send(createErrorsMessages(newUserResult.errorMessage!));
            return
        }
        const user = await this.queryRepo.findUserByIdOrFail(newUserResult.data!.id);
        if(!user){
            res.sendStatus(httpStatus.ExtraError);
            return
        }
        res.sendStatus(httpStatus.NoContent);
    }
    async resendConfirmationHandler(req:Request, res: Response) {
        const { email } = req.body; // достаём строку email
        const userEmail = await this.queryRepo.checkEmailConfirmation(email);
        if(!userEmail) {
            res.status(httpStatus.BadRequest).send({
                errorsMessages: [
                    {
                        "message": "bad request",
                        "field": "email"
                    }
                ]
            });
            return
        }
        const result = await this.usersService.updateConfirmationCode(email)
        res.sendStatus(httpStatus.NoContent)
        //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)
        //ну и 400 если некорректная почта или уже подтверждена
    }
    async refreshHandler(req: Request, res: Response){
        //проверяем,пришел ли в куки рефреш-токен
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        // ВАЖНО: Сначала проверяем валидность токена
        //ищем, обновляем пару
        const result = await this.authService.updateRefreshToken(refreshToken);
        if(result.status !== ResultStatuses.success){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        //отправляем пользователю
        res.cookie("refreshToken", result.data!.refreshToken, {
            httpOnly: true,
            secure: true,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 20 * 1000 // 20 secund в ms
        });
        res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken})
    }
    async logoutHandler(req: Request, res: Response): Promise<void> {
        // check actual token
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        // вносим изменения в БД, т.е. протухаем существующий токен
        const result = await this.authService.removeRefreshToken(refreshToken);
        //проверяем статус того че пришло из БД
        if(result.status !== ResultStatuses.success){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        //очищаем куки и возвращаем ответочку
        res.clearCookie("refreshToken");
        res.sendStatus(httpStatus.NoContent)
    }
    async passwordRecoveryHandler(req: Request, res: Response): Promise<void> {
        //получаем email
        const email = req.body.email;
        //отдаем его в сервис и говорим "отправь код восстановления пароля"
        const result = await this.authService.recoveryPassword(email);
        //успешно? отправляем 204
        res.sendStatus(httpStatus.NoContent)
    }
    async setNewPasswordHandler(req: Request, res: Response): Promise<void> {
        //забираем данные из боди
        const input = req.body;
        //отдаем в сервис и говорим "обнови"
        const result = await this.authService.setNewPassword(input.newPassword, input.recoveryCode);
        //получаем результат
        if(result.status !== ResultStatuses.success) {
            res.sendStatus(httpStatus.BadRequest);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }
}