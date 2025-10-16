import express from 'express';
import {setupApp} from "./setup-app";
import {dbSettings, runDB} from "./core/db/mongoDB.db";

async function main() {
    const app = express();
    app.set('trust proxy', true);  //это для прокти в отображении ip для сессий
    setupApp(app);


    const PORT = process.env.PORT || 5005;

    //подключаем к проекту БД (тк мы обращаемся на сервер и требуется подождать ответ, то оборачиваем в async/await)
    //* тк у нас появилась БД на удаленном сервере, то и все запросы на неё требуется обернуть в async/await *//
    await runDB(dbSettings.MONGO_URL);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}!`);
    })
}



main()