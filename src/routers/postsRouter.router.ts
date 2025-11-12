import {Router} from 'express';
import {idValidation} from "../core/validation/paramsIdValidation.validation";
import {basicGuard} from "../core/auth/basicGuard.middleware";
import {checkValidationErrors} from "../core/errors/validationErrorResult.handler";
import {postInputValidation} from "../core/validation/postInputValidation.validation";
import {tokenGuard} from "../core/auth/tockenGuard.middleware";
import {postIdValidation} from "../core/validation/postIdValidation.validation";
import {commentInputValidation} from "../core/validation/commentInputValidation.validation";
import {container} from "../composition-root";
import {PostsController} from "../classes/posts";

export const postsRouter = Router({});
const postsController =  container.get(PostsController)
postsRouter
    .get('/', /*queryPaginationValidation(PostsSortFields), checkValidationErrors,*/ postsController.getAllPostsHandler.bind(postsController))
    .get('/:id', idValidation, checkValidationErrors, postsController.getPostByIdHandler.bind(postsController))
    .post('/', basicGuard, postInputValidation, checkValidationErrors, postsController.createPostHandler.bind(postsController))
    .put('/:id', basicGuard, idValidation, postInputValidation, checkValidationErrors, postsController.changePostHandler.bind(postsController))
    .delete('/:id', basicGuard, idValidation, checkValidationErrors, postsController.removePostHandler.bind(postsController))
    .post('/:postId/comments', tokenGuard, postIdValidation, commentInputValidation, checkValidationErrors, postsController.createCommentForPostHandler.bind(postsController))
    .get('/:postId/comments', postIdValidation, /*queryPaginationValidation(PostsSortFields),*/ checkValidationErrors, postsController.createCommentForPostHandler.bind(postsController))
    // .post('/postId/test', tokenGuard, postIdValidation,commentInputValidation, checkValidationErrors, async(req:Request,res:Response)=>{
    //     //получаем postId
    //     const postId = req.params.postId;
    //     const post = await queryRepo.findPostByIdOrFail(postId);
    //     if(!post) {
    //         res.sendStatus(httpStatus.NotFound);
    //         return
    //     }
    //     const userId = req.userId;
    //     if(!userId) {
    //         res.sendStatus(httpStatus.Unauthorized);
    //         return
    //     }
    //     const user = await queryRepo.findUserByIdOrFail(userId);
    //     if(!user) {
    //         res.sendStatus(httpStatus.NotFound);
    //         return
    //     }
    //     res.status(httpStatus.Created).send({postId: post.id, userId: user.id});
    // })
