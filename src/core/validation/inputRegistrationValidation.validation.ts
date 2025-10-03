import {body} from "express-validator";


const login = body('login')
    .exists()
    .withMessage('loginOrEmail is required')
    .trim()
    .isString().withMessage('loginOrEmail must be string')
    .isLength({ min: 3, max: 10 })
    .withMessage('It must be more than 1 symbol')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage("Login can only contain letters, numbers, _ or -")

const password = body('password')
    .exists()
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be greater than 1 symbol')

const email = body('email')
    .exists().withMessage('Email is required')
    .trim()
    .isString().withMessage('Email must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol')
    .isEmail()
    .withMessage('email must look like email')
    // .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage("Email can only contain letters, numbers, _ or -")

export const inputRegistrationValidation = [login, password, email];