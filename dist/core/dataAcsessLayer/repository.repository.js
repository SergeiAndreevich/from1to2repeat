"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repository = void 0;
const mongoDB_db_1 = require("../db/mongoDB.db");
// export const repository = {
//     async removeAllData() {
//         await usersCollection.deleteMany({});
//         await postsCollection.deleteMany({});
//         await blogsCollection.deleteMany({});
//         await commentsCollection.deleteMany({});
//         await authCollection.deleteMany({});
//         await protectionCollection.deleteMany({});
//         return
//     },
// }
class Reporitory {
    async removeAllData() {
        await mongoDB_db_1.usersCollection.deleteMany({});
        await mongoDB_db_1.postsCollection.deleteMany({});
        await mongoDB_db_1.blogsCollection.deleteMany({});
        await mongoDB_db_1.commentsCollection.deleteMany({});
        await mongoDB_db_1.authCollection.deleteMany({});
        await mongoDB_db_1.protectionCollection.deleteMany({});
        return;
    }
}
exports.repository = new Reporitory();
