"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("./setup-app");
const mongoDB_db_1 = require("./core/db/mongoDB.db");
async function main() {
    const app = (0, express_1.default)();
    app.set('trust proxy', true); //это для прокти в отображении ip для сессий
    (0, setup_app_1.setupApp)(app);
    const PORT = process.env.PORT || 5005;
    //подключаем к проекту БД (тк мы обращаемся на сервер и требуется подождать ответ, то оборачиваем в async/await)
    //* тк у нас появилась БД на удаленном сервере, то и все запросы на неё требуется обернуть в async/await *//
    await (0, mongoDB_db_1.runDB)(mongoDB_db_1.dbSettings.MONGO_URL);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}!`);
    });
}
main();
