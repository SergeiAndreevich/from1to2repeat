"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectionCollection = exports.authCollection = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.client = exports.dbSettings = void 0;
exports.runDB = runDB;
const mongodb_1 = require("mongodb");
exports.dbSettings = {
    PORT: process.env.PORT || 5005,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27018',
    DB_NAME: process.env.DB_NAME || 'dbIncubator'
};
async function runDB(url) {
    //инициализация подключения к Монго, а именно к нашей БД
    exports.client = new mongodb_1.MongoClient(url);
    //обращение к нашей БД на сервере (там БД мб куча, а нам нужна именно эта)
    const db = exports.client.db(exports.dbSettings.DB_NAME);
    exports.blogsCollection = db.collection('blogs');
    exports.postsCollection = db.collection('posts');
    exports.usersCollection = db.collection('users');
    exports.commentsCollection = db.collection('comments');
    exports.authCollection = db.collection('auth');
    exports.protectionCollection = db.collection('protection');
    //тестовое подключение
    try {
        await exports.client.connect();
        await db.command({ ping: 1 });
    }
    catch (e) {
        await exports.client.close();
        throw new Error(`Could not connect to the database ${e}`);
    }
}
