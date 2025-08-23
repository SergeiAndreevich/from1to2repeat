import {body} from "express-validator";

export const emailValidation = body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be string')
    .trim()
    .isLength({ min: 1})
    .isEmail()
    .withMessage('Email must be a valid email address')