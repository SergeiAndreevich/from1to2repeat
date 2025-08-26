import {Collection, Db, MongoClient} from "mongodb";
import {TypeBlog} from "../../Entity/Blogs/Blog.types";
import {TypePost} from "../../Entity/Posts/Post.types";
import {TypeUser, TypeUserExtended} from "../../Entity/Users/User.types";
import {TypeComment} from "../../Entity/Comments/Comment.types";

export const dbSettings = {
    PORT: process.env.PORT || 5005,
    MONGO_URL:  process.env.MONGO_URL || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'dbIncubator'
}

//прописали типы здесь, чтобы экспортировать
export let client: MongoClient;
export let blogsCollection: Collection<TypeBlog>;
export let postsCollection: Collection<TypePost>;
export let usersCollection: Collection<TypeUserExtended>;
export let commentsCollection: Collection<TypeComment>;

export async function runDB(url:string):Promise<void> {
    //инициализация подключения к Монго, а именно к нашей БД
    client = new MongoClient(url);
    //обращение к нашей БД на сервере (там БД мб куча, а нам нужна именно эта)
    const db:Db = client.db(dbSettings.DB_NAME);

    blogsCollection= db.collection<TypeBlog>('blogs');
    postsCollection= db.collection<TypePost>('posts');
    usersCollection= db.collection<TypeUserExtended>('users');
    commentsCollection= db.collection<TypeComment>('comments');

    //тестовое подключение
    try{
        await client.connect();
        await db.command({ping: 1})
    }
    catch(e){
        await client.close();
        throw new Error(`Could not connect to the database ${e}`);
    }
}