import express from "express";
import {setupApp} from "../../src/setup-app";

import request from "supertest";
import {TypeUserInputModel} from "../../src/Entity/Users/User.types";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";



describe('test users', ()=> {
    const app = express();
    setupApp(app);

    const testUser: TypeUserInputModel = {
        login: 'qwerty',
        password: '123456',
        email: 'qwerty@mail.ru'
    };
    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    afterAll(async () => {
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    })

})