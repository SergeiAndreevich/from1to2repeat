"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectionCollection = exports.authCollection = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.client = exports.dbSettings = void 0;
exports.runDB = runDB;
const mongodb_1 = require("mongodb");
exports.dbSettings = {
    PORT: process.env.PORT || 5005,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27018',
    DB_NAME: process.env.DB_NAME || 'dbIncubator'
};
function runDB(url) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield exports.client.connect();
            yield db.command({ ping: 1 });
        }
        catch (e) {
            yield exports.client.close();
            throw new Error(`Could not connect to the database ${e}`);
        }
    });
}
