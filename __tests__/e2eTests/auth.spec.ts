import express from "express";
import {setupApp} from "../../src/setup-app";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import request from "supertest";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import { PATH } from "../../src/core/path";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";

describe('Testing auth enpoints', () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
    });
    it('should return 400 cause this user already exists', (done) => {
        const user = request(app).post(PATH.users).set('Authorization', basicToken()).send({
            "login": "4y4",
            "password": "string",
            "email": "example@example.com"
        }).expect(httpStatus.Created);
        request(app).post(`${PATH.auth}/registration`).send({
            "login": "4y4",
            "password": "string",
            "email": "example@example.com"
        }).expect(httpStatus.BadRequest)
    })
})