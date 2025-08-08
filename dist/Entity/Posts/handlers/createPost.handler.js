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
exports.createPostHandler = createPostHandler;
const postsService_bll_1 = require("../BLL/postsService.bll");
const queryRepo_repository_1 = require("../../../core/dataAcsessLayer/queryRepo.repository");
const httpStatuses_type_1 = require("../../../core/types/httpStatuses.type");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdId = yield postsService_bll_1.postsService.createPost(req.body);
        //доп проверка
        if (!createdId) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        const createdPost = yield queryRepo_repository_1.queryRepo.findPostByIdOrFail(createdId);
        if (!createdPost) {
            res.sendStatus(httpStatuses_type_1.httpStatus.ExtraError);
            return;
        }
        //по документации тут должен быть только 201 и ничего другого, но я сделал отсебятины
        res.status(httpStatuses_type_1.httpStatus.Created).send(createdPost);
    });
}
//400 в валидации
//401 в авторизации
