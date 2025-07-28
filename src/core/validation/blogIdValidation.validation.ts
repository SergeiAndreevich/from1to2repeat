import {param} from "express-validator";
import {queryRepo} from "../dataAcsessLayer/queryRepo.repository";

export const blogIdValidation = param('blogId')
    .exists()
    .withMessage('BlogId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view')
    .custom(async (value) => {
        // value - это значение blogId, которое нужно проверить
        await queryRepo.findBlogByIdOrFail(value);
        return
    })
    .withMessage('Blog with this id does not exist')

// express-validator не требует обязательно бросать ошибку (throw). Он смотрит на:
//
// Возвращаемое значение Promise (или async/await).
//
// Любое "ложное" (falsy) значение (null, undefined, false) → валидация провалена.
//
// "Истинное" (truthy) значение (объект, true, строка) → валидация пройдена.