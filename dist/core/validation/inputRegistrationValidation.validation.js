"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputRegistrationValidation = void 0;
const express_validator_1 = require("express-validator");
const login = (0, express_validator_1.body)('login')
    .exists()
    .withMessage('loginOrEmail is required')
    .trim()
    .isString().withMessage('loginOrEmail must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol');
const password = (0, express_validator_1.body)('password')
    .exists()
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 1 })
    .withMessage('Password must be greater than 1 symbol');
const email = (0, express_validator_1.body)('email')
    .exists().withMessage('Email is required')
    .trim()
    .isString().withMessage('Email must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol')
    .isEmail()
    .withMessage('email must look like email');
exports.inputRegistrationValidation = [login, password, email];
