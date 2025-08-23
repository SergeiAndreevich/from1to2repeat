import {body} from "express-validator";


const login = body('login')
    .exists()
    .withMessage('loginOrEmail is required')
    .trim()
    .isString().withMessage('loginOrEmail must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol')

const password = body('password')
    .exists()
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 1 })
    .withMessage('Password must be greater than 1 symbol')

const email = body('email')
    .exists().withMessage('Email is required')
    .trim()
    .isString().withMessage('Email must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol')
    .isEmail()
    .withMessage('email must look like email')

export const inputRegistrationValidation = [login, password, email];