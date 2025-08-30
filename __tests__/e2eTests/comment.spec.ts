import express from "express";
import {setupApp} from "../../src/setup-app";

import request from "supertest";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import {TypeCommentInputModel} from "../../src/Entity/Comments/Comment.types";
import {PATH} from "../../src/core/path";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";
// @ts-ignore
import {testBlogExample, testPostExample} from "./helpers/createTestObjects.helper";
import {TypeUserInputModel} from "../../src/Entity/Users/User.types";
//структура респонса всегда имеет body
//в get из-за пагинации еще вложенность body.items



describe('test comments', ()=> {
    const app = express();
    setupApp(app);

    const testComment: TypeCommentInputModel = {
        content: '123456'
    };
    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    afterAll(async () => {
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    })

    it('should create a new comment, get. change and delete', async () => {
        //создали блог
        const blog = await request(app).post(PATH.blogs)
            .set('Authorization', basicToken()).send(testBlogExample).expect(httpStatus.Created);
        //в блоге создали пост
        const post = await request(app).post(PATH.posts)
            .set('Authorization', basicToken()).send({...testPostExample, blogId: blog.body.id}).expect(httpStatus.Created);
        //создаем юзера
        const testUser:TypeUserInputModel = {login: 'testlogin', email: 'test@mail.ru', password: '123456'};
        const user= await request(app).post(PATH.users).set('Authorization', basicToken())
            .send(testUser)
            //.expect(httpStatus.Created);
        console.log(user.body)
        //аутентифицируемся как этот юзер и в ответ на авторизацию получаем права доступа
        const bearerToken = await request(app).post(`${PATH.auth}/login`)
            .send({loginOrEmail:user.body.login,password: user.body.password})
            //.expect(httpStatus.Ok);
        console.log(bearerToken.body)
        //создаем комментирай как авторизированный пользователь
        const comment = await request(app).post(`${PATH.posts}/${post.body.id}/comments`)
            .set('Authorization', bearerToken.body).send(testComment).expect(httpStatus.Created);

        //получаем коммент
        const getTry = await request(app).get(`${PATH.comments}/${comment.body.id}`).expect(httpStatus.Ok);
        expect(comment.body.content).toBe('123456');

        //теперь изменим комментарий
        const changedComment = await request(app).put(`${PATH.comments}/${comment.body.id}`)
            .set('Authorization', bearerToken.body).send({content: 'newtext'}).expect(httpStatus.NoContent);

        //получим обратно и сравним
        const getComment = await request(app).get(`${PATH.comments}/${comment.body.id}`).expect(httpStatus.Ok);
        expect(comment.body.content).toBe('newtext');

        //а теперь наконец-то удалим
        await request(app).delete(`${PATH.comments}/${comment.body.id}`).set('Authorization', bearerToken.body).expect(httpStatus.NoContent);
    })


})