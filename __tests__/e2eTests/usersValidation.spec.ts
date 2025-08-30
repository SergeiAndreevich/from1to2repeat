// import express from "express";
// import request from "supertest";
// import {setupApp} from "../../src/setup-app";
// import {TypeUserInputModel} from "../../src/Entity/Users/User.types";
// import {runDB} from "../../src/core/db/mongoDB.db";
// import {httpStatus} from "../../src/core/types/httpStatuses.type";
//
//
// describe('test users', ()=> {
//     const app = express();
//     setupApp(app);
//
//     const invalidPostSet: TypeUserInputModel = {
//         login: '',
//         password: '',
//         email: ''
//     };
//     let errorsBody: ValidationErrorsStore;
//     const token = createAuthorizationToken();
//     beforeAll(async () => {
//         await runDB(SETTINGS.MONGO_URL);
//         await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
//     });
//     afterAll(async () => {
//         await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
//     })
//     it('should not create a new user', async () => {
//         const res = await request(app).post(PATH.users).set('Authorization', token).send(invalidPostSet).expect(httpStatus.BadRequest);
//         errorsBody = res.body;
//         //console.log('Errors body',errorsBody);
//         expect(errorsBody.errorsMessages.length).toBe(3);
//
//         const users = await request(app).get(PATH.users).set('Authorization', token).expect(httpStatus.Ok);
//         //expect(users.body.items.length).toBe(0)
//     });
// })