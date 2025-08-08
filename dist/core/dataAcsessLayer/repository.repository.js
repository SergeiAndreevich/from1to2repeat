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
exports.repository = void 0;
const ResultObject_type_1 = require("../types/ResultObject.type");
const mongoDB_db_1 = require("../db/mongoDB.db");
const mongodb_1 = require("mongodb");
exports.repository = {
    findUserByLoginOrFail(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDB_db_1.usersCollection.findOne({ login: userLogin });
            if (!user) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            return { data: user._id.toString(), status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    findUserByEmailOrFail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDB_db_1.usersCollection.findOne({ email: userEmail });
            if (!user) {
                return { data: null, status: ResultObject_type_1.ResultStatuses.notFound };
            }
            return { data: user._id.toString(), status: ResultObject_type_1.ResultStatuses.success };
        });
    },
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield mongoDB_db_1.usersCollection.insertOne(newUser);
            return createdUser.insertedId.toString();
        });
    },
    removeUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
            return;
        });
    },
    removeComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
            return;
        });
    },
    removeAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.usersCollection.deleteMany({});
            yield mongoDB_db_1.postsCollection.deleteMany({});
            yield mongoDB_db_1.blogsCollection.deleteMany({});
            yield mongoDB_db_1.commentsCollection.deleteMany({});
            return;
        });
    },
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield mongoDB_db_1.postsCollection.insertOne(newPost);
            return createdPost.insertedId.toString();
        });
    },
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield mongoDB_db_1.blogsCollection.insertOne(blog);
            return newBlog.insertedId.toString();
        });
    },
    createComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdComment = yield mongoDB_db_1.commentsCollection.insertOne(newComment);
            return createdComment.insertedId.toString();
        });
    },
    updateBlog(id, newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    name: newBlog.name,
                    description: newBlog.description,
                    websiteUrl: newBlog.websiteUrl
                }
            });
            return;
        });
    },
    removeBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return;
        });
    },
    updatePost(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    content: newPost.content,
                    blogId: newPost.blogId
                }
            });
            return;
        });
    },
    removePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return;
        });
    },
    updateComment(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    content: dto.content
                }
            });
            return;
        });
    }
};
