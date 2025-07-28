import {body} from "express-validator";

const titleValidation = body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be string')
    .trim()
    .isLength({max: 30})
    .withMessage('Title should be less 30 characters')

const shortDescriptionValidation = body('title')
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage('shortDescription should be string')
    .trim()
    .isLength({max: 100})
    .withMessage('shortDescription should be less 30 characters')

const contentValidation = body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content should be string')
    .trim()
    .isLength({max: 1000})
    .withMessage('Content should be less 30 characters')

export const PostToBlogInputValidation = [titleValidation, shortDescriptionValidation, contentValidation]