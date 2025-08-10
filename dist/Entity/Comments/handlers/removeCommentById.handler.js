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
exports.removeCommentByIdHandler = removeCommentByIdHandler;
const commentService_bll_1 = require("../BLL/commentService.bll");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
function removeCommentByIdHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentId = req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const user = yield queryRepo_repository_1.queryRepo.findUserByIdOrFail(userId);
        const comment = yield queryRepo_repository_1.queryRepo.findCommentByIdOrFail(commentId);
        if (!user || !comment) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        if (comment.commentatorInfo.userId === user.id) {
            yield commentService_bll_1.commentService.removeComment(commentId);
            res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.Forbidden);
    });
}
