"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.postIdValidation = (0, express_validator_1.param)('postId')
    .exists()
    .withMessage('PossId is required')
    .isString()
    .withMessage('PostId must be a string')
    .trim()
    .isMongoId()
    .withMessage('PostId must be a MongoId');
// .custom(async (value)=> {
//     await queryRepo.findPostByIdOrFail(value);
//     return value
//
// })
// .withMessage('Post does not exist')
