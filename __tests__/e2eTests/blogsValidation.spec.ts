import {setupApp} from "../../src/setup-app";
import express from "express";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import request from "supertest";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import {TypeBlogInputModel} from "../../src/Entity/Blogs/Blog.types";
import {PATH} from "../../src/core/path";
import {createBasic} from "./helpers/createAuthHeader.helper";

describe('Blogs validation tests', () => {
    const app =  express();
    setupApp(app);

    beforeAll(async () => {
        //включи докер
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('testing/all-data').expect(httpStatus.NoContent)
    })
    afterAll(async () => {
        await request(app).delete('testing/all-data').expect(httpStatus.NoContent)
    })

    const testBlog:TypeBlogInputModel = {
        name: '',
        description: '',
        websiteUrl: ''
    }

    it('should not create a new blog', async () => {
        const  response = await request(app).post(PATH.blogs).set('Authorization', createBasic())
            .send(testBlog).expect(httpStatus.Unauthorized)
    })

})