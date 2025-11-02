import {QueryRepo} from "./core/dataAcsessLayer/queryRepo.repository";
import {BlogsController} from "./routers/blogsRouter.router";
import {BlogsService} from "./Entity/Blogs/BLL/blogsService.bll";
import {BlogsRepository} from "./core/dataAcsessLayer/repository/blogsRepository.repository";
import {PostsRepository} from "./core/dataAcsessLayer/repository/postsRepository.repository";
import {CommentsController} from "./routers/commentsRouter.router";
import {CommentService} from "./Entity/Comments/BLL/commentService.bll";
import {CommentRepository} from "./core/dataAcsessLayer/repository/commentRepository.repository";
import {PostsController} from "./routers/postsRouter.router";
import {PostsService} from "./Entity/Posts/BLL/postsService.bll";
import {SecurityController} from "./routers/securityDevices.router";
import {SessionsRepo} from "./core/dataAcsessLayer/repository/sessionsRepository.repository";
import {SessionsService} from "./core/auth/BLL/sessionsService.bll";
import {UsersController} from "./routers/usersRouter.router";
import {UsersService} from "./Entity/Users/BLL/usersService.bll";

const queryRepo: QueryRepo = new QueryRepo();
const sessionsRepo: SessionsRepo = new SessionsRepo();
const blogsRepository: BlogsRepository = new BlogsRepository();
const postsRepository: PostsRepository = new PostsRepository();
const commentRepository: CommentRepository = new CommentRepository();

const blogsService = new BlogsService(queryRepo, postsRepository, blogsRepository);
const postsService = new PostsService();
const commentService: CommentService = new CommentService(commentRepository);
const sessionsService : SessionsService = new  SessionsService();
const usersService: UsersService = new UsersService();

export const blogsController = new BlogsController(queryRepo, blogsService);
export const commentController = new CommentsController(queryRepo, commentService);
export const postsController = new PostsController(queryRepo,postsService,commentService);
export const securityController = new SecurityController(sessionsRepo, sessionsService, queryRepo);
export const usersController = new UsersController(queryRepo,usersService);


//а че везде надо прописывать в классах this?