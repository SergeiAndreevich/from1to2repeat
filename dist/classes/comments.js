"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
const inversify_1 = require("inversify");
const queryRepo_repository_1 = require("../core/dataAcsessLayer/queryRepo.repository");
const commentService_bll_1 = require("../Entity/Comments/BLL/commentService.bll");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
let CommentsController = class CommentsController {
    constructor(queryRepo, commentService) {
        this.queryRepo = queryRepo;
        this.commentService = commentService;
    }
    async getCommentByIdHandler(req, res) {
        const comment = await this.queryRepo.findCommentByIdOrFail(req.params.id);
        if (!comment) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_type_1.httpStatus.Ok).send(comment);
    }
    async updateCommentHandler(req, res) {
        const commentId = req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        const comment = await this.queryRepo.findCommentByIdOrFail(commentId);
        if (!user || !comment) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        if (comment.commentatorInfo.userId === user.id) {
            await this.commentService.updateComment(commentId, req.body);
            res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.Forbidden);
    }
    async removeCommentByIdHandler(req, res) {
        const commentId = req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        const comment = await this.queryRepo.findCommentByIdOrFail(commentId);
        if (!user || !comment) {
            res.sendStatus(httpStatuses_type_1.httpStatus.NotFound);
            return;
        }
        if (comment.commentatorInfo.userId === user.id) {
            await this.commentService.removeComment(commentId);
            res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
            return;
        }
        res.sendStatus(httpStatuses_type_1.httpStatus.Forbidden);
    }
};
exports.CommentsController = CommentsController;
exports.CommentsController = CommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(queryRepo_repository_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(commentService_bll_1.CommentService)),
    __metadata("design:paramtypes", [queryRepo_repository_1.QueryRepo,
        commentService_bll_1.CommentService])
], CommentsController);
