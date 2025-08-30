// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from "express";
import {setupApp} from "../../src/setup-app";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import { PATH } from '../../src/core/path';
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";
// @ts-ignore
import {testBlogExample} from "./helpers/createTestObjects.helper";
import {TypeBlogInputModel} from "../../src/Entity/Blogs/Blog.types";

//структура респонса всегда имеет body
//в get из-за пагинации еще вложенность body.items


describe('test blogs', ()=>{
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    it('creates a new blog', async () => {
         await request(app).post(PATH.blogs).set('Authorization', basicToken()).send(testBlogExample).expect(201);
         //либо авторизироваться не может, либо не проходит валидацию
    });
    it('find all blogs', async () => {
        await request(app).post(PATH.blogs).set('Authorization', basicToken()).send(testBlogExample).expect(httpStatus.Created);
        const blogs = await request(app).get(PATH.blogs).set('Authorization', basicToken()).expect(httpStatus.Ok);
        //console.log(blogs.body);
        expect(blogs.body).toBeInstanceOf(Object);
        expect(blogs.body.items.length).toBeGreaterThanOrEqual(2);
    });
    it('should change blog by id',  async () => {
        const blogs = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        const id = blogs.body.items[0].id;
        const updateData: TypeBlogInputModel = {
            name: "new name",
            description: "new description",
            websiteUrl: "https://asd.ru"
        };
        await request(app).put(`${PATH.blogs}/${id}`).set('Authorization', basicToken()).send(updateData).expect(httpStatus.NoContent);
        const blogResponse = await request(app).get(`${PATH.blogs}/${id}`).expect(httpStatus.Ok)

        expect(blogResponse.body).toEqual({
            id: id,
            name: updateData.name,
            description: updateData.description,
            websiteUrl: updateData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        });

    });
    it('should remove blog by id',  async () => {
        const blogs = await request(app).get(PATH.blogs).expect(httpStatus.Ok);
        const id = blogs.body.items[0].id;
        await request(app)
            .delete(`${PATH.blogs}/${id}`)
            .set('Authorization', basicToken())
            .expect(httpStatus.NoContent);

        await request(app)
            .get(`${PATH.blogs}/${id}`)
            .set('Authorization', basicToken())
            .expect(httpStatus.NotFound);
    });
})