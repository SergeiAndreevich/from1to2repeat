import express from "express";
import {setupApp} from "../../src/setup-app";
import request from "supertest";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import { PATH } from "../../src/core/path";
// @ts-ignore
import {TestBlog, testBlogExample} from "./helpers/createTestObjects.helper";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";


describe('Testing Web Storm...', () => {
    //сначала создаем экземпляр экспресса
    const app = express();
    //запускаем
    setupApp(app);

    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });

    it('should create blog', async () => {
        const blog = await request(app).post(PATH.blogs).set('Authorization', basicToken()).send({    name: 'testBlogExample',
            description: 'testBlogExample',
            websiteUrl: 'http://localhost.ru'}).expect(201)
        await request(app).get(PATH.blogs).expect(200);
    })
})