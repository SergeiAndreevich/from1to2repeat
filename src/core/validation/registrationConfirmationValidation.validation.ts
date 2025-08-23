import {body} from "express-validator";

export const registrationConfirmationValidation = body('code')
    .exists()
    .withMessage('Registration confirmation code is required')
    .isString()
    .withMessage('Registration confirmation code must be string')
    .trim()
    .isLength({min: 1})
    .withMessage('Wrong code length')

