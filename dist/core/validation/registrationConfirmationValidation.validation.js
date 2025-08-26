"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationConfirmationValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registrationConfirmationValidation = (0, express_validator_1.body)('code')
    .exists()
    .withMessage('Registration confirmation code is required')
    .isString()
    .withMessage('Registration confirmation code must be string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Wrong code length');
