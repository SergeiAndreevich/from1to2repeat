// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from "express";
import {setupApp} from "../../src/setup-app";
import { PATH } from '../../src/core/path';
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
// @ts-ignore
import {testBlogExample, testPostExample} from "./helpers/createTestObjects.helper";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";
import {TypePostInputModel} from "../../src/Entity/Posts/Post.types";


describe('test posts', ()=>{
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });

    it('creates a new post', async () => {
        const blog = await request(app).post(PATH.blogs)
            .set('Authorization', basicToken()).send(testBlogExample).expect(httpStatus.Created);
        await request(app).post(PATH.posts).set('Authorization', basicToken()).send({...testPostExample, blogId: blog.body.id}).expect(httpStatus.Created);
    });
    it('find all posts and find post by id', async () => {
        const posts = await request(app).get(PATH.posts).expect(httpStatus.Ok);
        expect(posts.body.items).toBeInstanceOf(Array);
        expect(posts.body.items.length).toBeGreaterThanOrEqual(1);

        const post = await request(app).get(`${PATH.posts}/${posts.body.items[0].id}`).expect(httpStatus.Ok);
        expect(post.body.title).toEqual(testPostExample.title)

    });
    it('should change post by id and delete, additional methods getAll and getById',  async () => {
        //достаем все посты
        const posts = await request(app).get(PATH.posts).expect(httpStatus.Ok);
        //вытаскиваем нужный нам пост, а именно первый и единственный
        const post = await request(app).get(`${PATH.posts}/${posts.body.items[0].id}`).expect(httpStatus.Ok);
        //подготавливаем обновленные данные
        const updateData:TypePostInputModel = {
            title: 'new title',
            shortDescription: 'new description',
            content: 'content',
            blogId: post.body.blogId
        };
        //закидываем их на сервак
        await request(app).put(`${PATH.posts}/${posts.body.items[0].id}`).set('Authorization', basicToken())
            .send(updateData).expect(httpStatus.NoContent);
        //снова поулчаем этот пост и сравниваем, обновилось ли
        const postResponse = await request(app).get(`${PATH.posts}/${posts.body.items[0].id}`).expect(httpStatus.Ok);
        expect(postResponse.body).toEqual({
            id: post.body.id,
            title: updateData.title,
            shortDescription: updateData.shortDescription,
            content:  updateData.content,
            blogId: updateData.blogId,
            blogName: expect.any(String),
            createdAt: expect.any(String),
        });
        //а теперь удаляем
        await request(app).delete(`${PATH.posts}/${posts.body.items[0].id}`).set('Authorization', basicToken()).expect(httpStatus.NoContent)
    });
})