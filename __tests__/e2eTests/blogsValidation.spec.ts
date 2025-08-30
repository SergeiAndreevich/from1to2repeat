// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
//import {describe} from "node:test"; -------------------------------------------- Обрати вниманию сюда!!!!!!
// эта хрень забрала у тебя несколько часов жизни, неоднократно. Не наступай на одни и те же грабли! Проверяй и удаляй!
import {setupApp} from "../../src/setup-app";
import {TypeBlogInputModel} from "../../src/Entity/Blogs/Blog.types";
import {TypeErrorsStore} from "../../src/core/errors/validationErrorResult.handler";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import { PATH } from '../../src/core/path';
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";

describe('test blogs validation', ()=>{
    const app = express();
    setupApp(app);

    const invalidBlogSet: TypeBlogInputModel = {
        name: "",
        description: "",
        websiteUrl: "http://localhost"
    };
    let errorsBody : TypeErrorsStore;
    beforeAll(async () => {
        //законектились к БД и почистили ее вначале
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    it('should be unauthorized', async () => {
        await request(app).post(PATH.blogs).send({name: "test",  description: "test",   websiteUrl: "http://localhost.ru"}).expect(httpStatus.Unauthorized);
    })
    it('should not create a new blog', async () => {
        const res = await request(app).post(PATH.blogs).set('Authorization', basicToken()).send({...invalidBlogSet, name: '', description: '', websiteUrl:''}).expect(httpStatus.BadRequest);
        errorsBody = res.body;
        expect(errorsBody.errorsMessages).toHaveLength(3);  //теперь комментарий ниже не работает, тк мы поставили флаг only first error, то есть сколько ошибочных полей
        const blogs = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        //console.log(blogs)
        expect(blogs.body.items.length).toBe(0)
    });

    it('should not create blog',  async () => {
        const res = await request(app).post(PATH.blogs).set('Authorization', basicToken()).send(invalidBlogSet).expect(httpStatus.BadRequest);
        const blogs = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        expect(blogs.body.length === 0);
        errorsBody = res.body;
        expect(errorsBody.errorsMessages.length).toBe(3);
    });
    it('should not create blog',  async () => {
        const res = await request(app).post(PATH.blogs).set('Authorization', basicToken()).send({...invalidBlogSet, name: '    ', description: '    ', websiteUrl: '    '}).expect(httpStatus.BadRequest)
        errorsBody = res.body;
        expect(errorsBody.errorsMessages.length).toBe(3);
    })
    it('should not create blog',  async () => {
        const res = await request(app).post(PATH.blogs).set('Authorization', basicToken()).send({...invalidBlogSet, name: 1, description: 2, websiteUrl: 3}).expect(httpStatus.BadRequest);
        errorsBody = res.body;
        expect(errorsBody.errorsMessages.length).toBe(3)
    })
    it('should not change blog',  async () => {
        const createdBlog = await request(app).post(PATH.blogs).set('Authorization', basicToken()).send({name: 'Blog', description:'description', websiteUrl:'http://localhost.ru'});
        const res = await request(app).put(`${PATH.blogs}/${createdBlog.body.id}`).set('Authorization', basicToken()).send(invalidBlogSet).expect(httpStatus.BadRequest);
        errorsBody = res.body;
        expect(errorsBody.errorsMessages.length).toBe(3)
    })

})