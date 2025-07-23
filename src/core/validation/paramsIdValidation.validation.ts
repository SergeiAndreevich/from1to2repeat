import {param} from "express-validator";

export const idValidation= param('id')
    .exists()
    .withMessage('Id required')
    .isString()
    .withMessage('Id must be string')
    .isMongoId()
    .withMessage('Id must be MongoId')
    .isLength({ min: 1 })
    .withMessage('Id must be greater than 1')