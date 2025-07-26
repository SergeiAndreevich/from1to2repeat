import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";

export const postsRouter = Router({});

postsRouter
    .get('/')
    .post('/')
    .put('/:id', idValidation)
    .delete('/:id', idValidation);