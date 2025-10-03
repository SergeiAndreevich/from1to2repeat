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
exports.postInputValidation = void 0;
const express_validator_1 = require("express-validator");
const queryRepo_repository_1 = require("../dataAcsessLayer/queryRepo.repository");
const titleValidation = (0, express_validator_1.body)("title")
    .exists()
    .withMessage('title is required')
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Title length must be >1 and <30");
const shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage("ShortDescription must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("ShortDescription must be >1 and <100");
const contentValidation = (0, express_validator_1.body)("content")
    .exists()
    .withMessage('content is required')
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be >1 and <1000");
const blogIdValidation = (0, express_validator_1.body)("blogId")
    .exists()
    .withMessage("BlogId is required")
    .isString()
    .withMessage("BlogId must be a string")
    .isMongoId()
    .withMessage("BlogId must be a mongoID")
    .trim()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    // value - это значение blogId, которое нужно проверить
    yield queryRepo_repository_1.queryRepo.findBlogByIdOrFail(value);
    return;
}))
    .withMessage('Blog with this id does not exist');
exports.postInputValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
