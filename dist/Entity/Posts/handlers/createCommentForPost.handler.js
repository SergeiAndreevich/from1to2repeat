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
exports.createCommentForPostHandler = createCommentForPostHandler;
const commentService_bll_1 = require("../../Comments/BLL/commentService.bll");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
function createCommentForPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        const post = yield queryRepo_repository_1.queryRepo.findPostByIdOrFail(postId);
        if (!post) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const commentInput = req.body;
        const commentator = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(req.userId);
        const userInfo = {
            userId: commentator.id,
            userLogin: commentator.login
        };
        const createdId = yield commentService_bll_1.commentService.createComment(postId, commentInput, userInfo);
        const comment = yield queryRepo_repository_1.queryRepo.findCommentByIdOrFail(createdId);
        if (!comment) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Created).send(comment);
    });
}
