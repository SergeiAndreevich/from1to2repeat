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
exports.commentRepository = void 0;
const mongoDB_db_1 = require("../../db/mongoDB.db");
const mongodb_1 = require("mongodb");
exports.commentRepository = {
    removeComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDB_db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
            return;
        });
    },
    createComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdComment = yield mongoDB_db_1.commentsCollection.insertOne(newComment);
            return createdComment.insertedId.toString();
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
