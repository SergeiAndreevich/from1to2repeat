import {setupApp} from "../../src/setup-app";
import express from "express";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import request from "supertest";
import {PATH} from "../../src/core/path";
import {TypeBlogInputModel} from "../../src/Entity/Blogs/Blog.types";

// @ts-ignore
import {TestBlog} from "./helpers/createTestBlog.helper";
// @ts-ignore
import {createBasic} from "./helpers/createAuthHeader.helper";


describe('Testing blogs', () => {
    //подготовим приложение и БД для теста
    const app = express();
    setupApp(app);
    beforeAll(async () => {
        //включи докер
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('testing/all-data').expect(httpStatus.NoContent)
    })
    afterAll(async () => {
        await request(app).delete('testing/all-data').expect(httpStatus.NoContent)
    })

    const testData:TypeBlogInputModel = {
        name: 'TestBlogName',
        description: 'Test blog description',
        websiteUrl: 'https://example.com/blog'
    }

    // 1. Создаем блог 200, получаем список блогов 200
    // 2. Создали блог 200, получили список блогов 200, изменили один блог 204, удалили блог 204
    // 3. Получили список блогов 200, получили блог по id 200
    // 4. Получили список блогов 200, создать блог без ключа 401, изменить блог без ключа 401, удалить без ключа 401

    //начинаем писать e2e-тесты, а именно, последовательные
    it('create and get new blog', async () => {
        const blogResponse = await request(app).post(PATH.blogs).set('Authorization',createBasic())
            .send(new TestBlog(testData)).expect(httpStatus.Created);
        expect(blogResponse.body.name).toBe(testData.name);
        const blogsList = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        expect(blogsList.body.items.length).toBeGreaterThanOrEqual(1)
    })

    it('create, get 2 blogs, update first and remove second', async () => {
        const blogResponse = await request(app).post(PATH.blogs).set('Authorization',createBasic())
            .send(new TestBlog({name: 'Second', description: 'Second', websiteUrl: 'https://example.com'})).expect(httpStatus.Created);
        expect(blogResponse.body.name).toBe('Second');
        const blogsList = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        expect(blogsList.body.items.length).toBeGreaterThanOrEqual(2);
        await request(app).put(`${PATH.blogs}/${blogsList.body[0].id}`).set('Authorization',createBasic())
            .send({name:'NewName', description:'New description', websiteUrl:'https://new.com'}).expect(httpStatus.NoContent);
        await request(app).delete(`${PATH.blogs}/${blogsList.body[1].id}`).set('Authorization',createBasic()).expect(httpStatus.NoContent);
    })
    it('get changed blog by id', async ()=>{
        const blogsList = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        const blog = await request(app).get(`${PATH.blogs}/${blogsList.body[0].id}`).expect(httpStatus.Ok);
        expect(blog.body.name).toBe('NewName');
    })
    it('all unauthorized codes', async ()=>{
        const blogsList = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        await request(app).post(PATH.blogs)
            .send(new TestBlog({name: 'Second', description: 'Second', websiteUrl: 'https://example.com'})).expect(httpStatus.Unauthorized);
        await request(app).put(`${PATH.blogs}/${blogsList.body[0].id}`)
            .send({name:'NewName', description:'New description', websiteUrl:'https://new.com'}).expect(httpStatus.Unauthorized);
        await request(app).delete(`${PATH.blogs}/${blogsList.body[0].id}`).expect(httpStatus.Unauthorized);
    })
})