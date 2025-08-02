"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.blogIdValidation = (0, express_validator_1.param)('blogId')
    .exists()
    .withMessage('BlogId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view');
// .custom(async (value) => {
//     // value - это значение blogId, которое нужно проверить
//     await queryRepo.findBlogByIdOrFail(value);
//     return value
// })
// .withMessage('Blog with this id does not exist')
// express-validator не требует обязательно бросать ошибку (throw). Он смотрит на:
//
// Возвращаемое значение Promise (или async/await).
//
// Любое "ложное" (falsy) значение (null, undefined, false) → валидация провалена.
//
// "Истинное" (truthy) значение (объект, true, строка) → валидация пройдена.
