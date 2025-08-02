import express from "express";
import {setupApp} from "../../src/setup-app";

import request from "supertest";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import {TypePostInputModel} from "../../src/Entity/Posts/Post.types";



describe('test users', ()=> {
    const app = express();
    setupApp(app);

    const testPost: TypePostInputModel = {
        title: 'qwerty',
        shortDescription: '123456',
        content: 'qwerty@mail.ru',
        blogId: ''
    };
    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    afterAll(async () => {
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    })

})