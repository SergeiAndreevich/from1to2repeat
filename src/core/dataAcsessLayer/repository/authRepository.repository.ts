import {authCollection} from "../../db/mongoDB.db";
import {JwtPayload} from "jsonwebtoken";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {jwtHelper} from "../../helpers/jwt.helper";

export type TypeAccessDataModel = {
    jti: string;
    userId: string;
    expiresAt: Date;
    revoked: boolean;
}

export const authRepo = {
    async addRefreshToken(data: TypeAccessDataModel){
        await authCollection.insertOne(data)
        return
    },
    async updateTokens(refreshToken: JwtPayload):Promise<IResult<null | {accessToken: string, refreshToken: string}>>{
        //1️⃣ ищем и проверяем на актуальность введенный рефреш-токен
        const oldRefreshToken = await authCollection.findOne({jti: refreshToken.jti});
        if(!oldRefreshToken) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        // 2️⃣ если токен уже отозван — сразу 401
        if (oldRefreshToken.revoked) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        // 3️⃣ проверяем, не истёк ли токен (сравниваем корректно)
        const now = new Date();
        if (oldRefreshToken.expiresAt.getTime() < now.getTime()) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        // 🧠 Что происходит
        // Ты сравниваешь:
        // oldRefreshToken.expiresAt — дата в формате Date, хранящаяся в БД;
        // refreshToken.expiresAt — число в секундах UNIX, пришедшее из JWT.
        // Эти значения никогда не совпадут по масштабу (у одного миллисекунды, у другого секунды),
        // поэтому почти всегда условие oldRefreshToken!.expiresAt < refreshToken.expiresAt → true,
        // и ты возвращаешь unauthorized.

        // 4️⃣ протухаем старый рефреш-токен
        await authCollection.updateOne(
            {jti: refreshToken.jti},
            {$set: { revoked: true}}
        );
        //создаем новую пару аксес-рефреш
        const newAccessToken = await jwtHelper.generateAccessToken(oldRefreshToken.userId);
        const newRefreshToken = await jwtHelper.generateRefreshToken(oldRefreshToken.userId);

        //сохраняем в БД
        const decodedRefresh = await jwtHelper.verifyRefreshToken(newRefreshToken.refreshToken);
        const tokenToDb:TypeAccessDataModel = {
            jti: newRefreshToken.jti,
            userId: oldRefreshToken.userId,
            expiresAt: new Date(decodedRefresh!.exp!* 1000),
            revoked: false
        }
        await authRepo.addRefreshToken(tokenToDb);
        return  {data: {accessToken: newAccessToken, refreshToken: newRefreshToken.refreshToken}, status: ResultStatuses.success}
    },
    async removeRefreshToken(token: JwtPayload):Promise<IResult<null>>{
        //ищем и проверяем на актуальность введенный рефреш-токен
        const oldRefreshToken = await authCollection.findOne({jti: token.jti});
        if(!oldRefreshToken) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        // 🔥 если токен уже отозван
        if (oldRefreshToken.revoked) {
            return { data: null, status: ResultStatuses.unauthorized };
        }
        if(oldRefreshToken!.expiresAt.getTime() < new Date().getTime()) {
            return {data: null, status: ResultStatuses.unauthorized}
        }
        //протухаем старый рефреш-токен
        await authCollection.updateOne({jti: token.jti},{$set: {
                revoked: true
        }});
        return {data: null, status: ResultStatuses.success}
    }
}