import {param} from "express-validator";
import {queryRepo} from "../dataAcsessLayer/queryRepo.repository";

export const postIdValidation = param('postId')
    .exists()
    .withMessage('PossId is required')
    .isString()
    .withMessage('PostId must be a string')
    .trim()
    .isMongoId()
    .withMessage('PostId must be a MongoId')
    // .custom(async (value)=> {
    //     await queryRepo.findPostByIdOrFail(value);
    //     return value
    //
    // })
    // .withMessage('Post does not exist')