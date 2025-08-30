import express from "express";
import {setupApp} from "../../src/setup-app";
import request from "supertest";

import {TypeUserInputModel} from "../../src/Entity/Users/User.types";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import { PATH } from "../../src/core/path";

describe('test users', ()=> {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });

    it('creates a new user', async () => {
        const testUser:TypeUserInputModel = {login: 'test', email: 'test@mail.ru', password: '123456'};
        const user= await request(app).post(PATH.users).set('Authorization', basicToken())
            .send(testUser).expect(httpStatus.Created);
        console.log(user.body)
        // //const newUser = await request(app).post(PATH.users).set('Authorization', token).send(testUser).expect(httpStatus.Created);
        // const newUser2 = await request(app).post(PATH.users).set('Authorization', token).send({login: 'qwert',
        //     password: '123456',email: 'qwert@mail.ru'}).expect(httpStatus.Created);
        // //console.log('NewUser2',newUser2.body);
        // const usersList = await request(app).get('/users').set('Authorization', token).expect(httpStatus.Ok);
        // //console.log(usersList.body);
        // //expect(newUser.body.password !== newUser2.body.password);
        //
        // //console.log(usersList.body);
        // const userId = usersList.body.items[0].id;
        // await request(app).delete(`${PATH.users}/${userId}`).set('Authorization', token).expect(httpStatus.NoContent);
        // const newUsersList = await request(app).get('/users').set('Authorization', token).expect(httpStatus.Ok);
        // expect(usersList.body.length === newUsersList.body.length-1);
    });
})