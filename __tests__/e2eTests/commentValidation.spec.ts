import express from "express";
import {setupApp} from "../../src/setup-app";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import request from "supertest";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import {PATH} from "../../src/core/path";
import {TypeCommentInputModel} from "../../src/Entity/Comments/Comment.types";
import {tokenGuard} from "../../src/core/auth/tockenGuard.middleware";

describe('Comment validation tests', () => {
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

    const testComment:TypeCommentInputModel = {
        content: ''
    }

    it('should not create a new comment', async () => {
        const  response = await request(app).put(PATH.blogs).set('Authorization', tokenGuard())
            .send(testComment).expect(httpStatus.Unauthorized)
    })

})