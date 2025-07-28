import {body} from "express-validator";
import {queryRepo} from "../dataAcsessLayer/queryRepo.repository";

const titleValidation = body("title")
    .exists()
    .withMessage('title is required')
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Title length must be >1 and <30");

const shortDescriptionValidation =  body("shortDescription")
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage("ShortDescription must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("ShortDescription must be >1 and <100");

const contentValidation = body("content")
    .exists()
    .withMessage('content is required')
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be >1 and <1000");

const blogIdValidation =  body("blogId")
    .exists()
    .withMessage("BlogId is required")
    .isString()
    .withMessage("BlogId must be a string")
    .isMongoId()
    .withMessage("BlogId must be a mongpID")
    .trim()
    .custom(async (value) => {
        // value - это значение blogId, которое нужно проверить
        await queryRepo.findBlogByIdOrFail(value);
        return
    })
    .withMessage('Blog with this id does not exist')

export const postInputValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
]

