import express from "express";
import {setupApp} from "../../src/setup-app";
import {dbSettings, runDB} from "../../src/core/db/mongoDB.db";
import request from "supertest";
import {httpStatus} from "../../src/core/types/httpStatuses.type";
import {PATH} from "../../src/core/path";
import {TypeCommentInputModel} from "../../src/Entity/Comments/Comment.types";
import {tokenGuard} from "../../src/core/auth/tockenGuard.middleware";
// @ts-ignore
import {basicToken} from "./helpers/createAuthHeader.helper";
// @ts-ignore
import {testBlogExample, testPostExample} from "./helpers/createTestObjects.helper";

describe('Comment validation tests', () => {
    const app =  express();
    setupApp(app);

    beforeAll(async () => {
        //включи докер
        await runDB(dbSettings.MONGO_URL);
        await request(app).delete('testing/all-data').expect(httpStatus.NoContent);
    })
    const testComment:TypeCommentInputModel = {
        content: 'comment'
    }
    it('should not create a new comment', async () => {
        const blog = await request(app).post(PATH.blogs)
            .set('Authorization', basicToken()).send(testBlogExample).expect(httpStatus.Created);
        const post = await request(app).post(PATH.posts)
            .set('Authorization', basicToken()).send({...testPostExample, blogId: blog.body.id}).expect(httpStatus.Created);
        const posts = await request(app).get(PATH.posts).expect(httpStatus.Ok);
        const  response = await request(app).post(`${PATH.posts}/${posts.body.items[0].id}/comments`).send(testComment)
            .expect(httpStatus.Unauthorized)
    })
    // it('should not create a new comment', async () => {
    //     const  response = await request(app).post(`${PATH.comments}/${post.body.id}/comments`)
    //         .set('Authorization', ----).send(testComment).expect(httpStatus.Unauthorized)
    // })
})