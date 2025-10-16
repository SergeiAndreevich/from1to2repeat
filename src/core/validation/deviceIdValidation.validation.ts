import {param} from "express-validator";

export const deviceIdValidation= param('deviceId')
    .exists()
    .withMessage('deviceId required')
    .isString()
    .withMessage('deviceId must be string')