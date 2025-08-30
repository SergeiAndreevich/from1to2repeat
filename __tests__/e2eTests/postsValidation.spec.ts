// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import {setupApp} from "../../src/setup-app";
import {TypePostInputModel} from "../../src/Entity/Posts/Post.types";
import {TypeErrorsStore} from "../../src/core/errors/validationErrorResult.handler";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";
import { PATH } from '../../src/core/path';


describe('test posts', ()=>{
    const app = express();
    setupApp(app);

    const invalidPostSet: TypePostInputModel = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: ""
    };
    let errorsBody : TypeErrorsStore;
    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    afterAll(async () => {
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    })
    it('should not create a new post', async () => {
        const res = await request(app).post(PATH.posts).set('Authorization', basicToken()).send(invalidPostSet).expect(httpStatus.BadRequest);
        errorsBody =  res.body;
        expect(errorsBody.errorsMessages.length).toBe(4);
        //теперь не будет 2 шт, тк только первую ошибку выдаем. Одно поле - первая ошибка, даже если их в этом поле сто штук.
        // 2 шт получается в blodId из-за того что пустой и не нумерик стринг
        const post = await request(app).get(PATH.posts).expect(httpStatus.Ok);
        expect(post.body.items.length).toBe(0)
    });
    it('should not create a new post', async () => {
        const res = await request(app).post(PATH.posts).set('Authorization', basicToken())
            .send({...invalidPostSet, title: '    b   b   ', shortDescription: '    a', content: 'b   ', blogId: 'a'})
            .expect(httpStatus.BadRequest); //потому что некорректный blogId
        errorsBody=res.body;
        expect(errorsBody.errorsMessages.length).toBe(1)
    });
    it('should not create a new post', async () => {
        const res = await request(app).post(PATH.posts).set('Authorization', basicToken()).send({...invalidPostSet,  title:1, shortDescription:2, content:3, blogId:4}).expect(httpStatus.BadRequest);
        errorsBody=res.body;
        expect(errorsBody.errorsMessages.length).toBe(4)
    })

})