"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const queryRepo_repository_1 = require("./core/dataAcsessLayer/queryRepo.repository");
const blogsService_bll_1 = require("./Entity/Blogs/BLL/blogsService.bll");
const blogsRepository_repository_1 = require("./core/dataAcsessLayer/repository/blogsRepository.repository");
const postsRepository_repository_1 = require("./core/dataAcsessLayer/repository/postsRepository.repository");
const commentService_bll_1 = require("./Entity/Comments/BLL/commentService.bll");
const commentRepository_repository_1 = require("./core/dataAcsessLayer/repository/commentRepository.repository");
const postsService_bll_1 = require("./Entity/Posts/BLL/postsService.bll");
const sessionsRepository_repository_1 = require("./core/dataAcsessLayer/repository/sessionsRepository.repository");
const sessionsService_bll_1 = require("./core/auth/BLL/sessionsService.bll");
const usersService_bll_1 = require("./Entity/Users/BLL/usersService.bll");
const inversify_1 = require("inversify");
const auth_1 = require("./classes/auth");
const usersRepository_repository_1 = require("./core/dataAcsessLayer/repository/usersRepository.repository");
const authRepository_repository_1 = require("./core/dataAcsessLayer/repository/authRepository.repository");
const authService_bll_1 = require("./core/auth/BLL/authService.bll");
const protectionRepo_repository_1 = require("./core/protection/DAL/protectionRepo.repository");
const protectionService_bll_1 = require("./core/protection/BLL/protectionService.bll");
const blogs_1 = require("./classes/blogs");
const comments_1 = require("./classes/comments");
const posts_1 = require("./classes/posts");
const security_1 = require("./classes/security");
const users_1 = require("./classes/users");
//ниже закоментирован самописный ioc-контейнер
// const queryRepo: QueryRepo = new QueryRepo();
// const sessionsRepo: SessionsRepo = new SessionsRepo();
// const blogsRepository: BlogsRepository = new BlogsRepository();
// const postsRepository: PostsRepository = new PostsRepository();
// const commentRepository: CommentRepository = new CommentRepository();
//
// const blogsService = new BlogsService(queryRepo, postsRepository, blogsRepository);
// const postsService = new PostsService();
// const commentService: CommentService = new CommentService(commentRepository);
// const sessionsService : SessionsService = new  SessionsService();
// const usersService: UsersService = new UsersService();
//
// export const blogsController = new BlogsController(queryRepo, blogsService);
// export const commentController = new CommentsController(queryRepo, commentService);
// export const postsController = new PostsController(queryRepo,postsService,commentService);
// export const securityController = new SecurityController(sessionsRepo, sessionsService, queryRepo);
//export const usersController = new UsersController(queryRepo,usersService);
//а че везде надо прописывать в классах this? yes!
//а теперь напишем кривой, но по сути верный ioc
// const data = [];
// data.push(queryRepo,sessionsRepo,blogsRepository,postsRepository,commentRepository,blogsService,postsService,
//     commentService,sessionsService,usersService,blogsController, commentController, postsController,securityController, usersController);
// export const ioc = {
//     getInstance(classType: any){
//         const target = data.filter(a => a instanceof classType);
//         return target
//     }
// }
//по логике выщей мы подключаем контейнер, который является ioc, и с помощью биндов подключаем все классы
//чтобы классы поняли, какие нужно использовать в конструкторе, то мы используем декораторы, которые описывают в классе
//необходимые дополнительные классы внутри
exports.container = new inversify_1.Container();
exports.container.bind(users_1.UsersController).to(users_1.UsersController);
exports.container.bind(security_1.SecurityController).to(security_1.SecurityController);
exports.container.bind(posts_1.PostsController).to(posts_1.PostsController);
exports.container.bind(comments_1.CommentsController).to(comments_1.CommentsController);
exports.container.bind(blogs_1.BlogsController).to(blogs_1.BlogsController);
exports.container.bind(auth_1.AuthController).to(auth_1.AuthController);
exports.container.bind(usersService_bll_1.UsersService).to(usersService_bll_1.UsersService);
exports.container.bind(sessionsService_bll_1.SessionsService).to(sessionsService_bll_1.SessionsService);
exports.container.bind(postsService_bll_1.PostsService).to(postsService_bll_1.PostsService);
exports.container.bind(commentService_bll_1.CommentService).to(commentService_bll_1.CommentService);
exports.container.bind(blogsService_bll_1.BlogsService).to(blogsService_bll_1.BlogsService);
exports.container.bind(authService_bll_1.AuthService).to(authService_bll_1.AuthService);
exports.container.bind(protectionService_bll_1.ProtectionService).to(protectionService_bll_1.ProtectionService);
exports.container.bind(queryRepo_repository_1.QueryRepo).to(queryRepo_repository_1.QueryRepo);
exports.container.bind(sessionsRepository_repository_1.SessionsRepo).to(sessionsRepository_repository_1.SessionsRepo);
exports.container.bind(postsRepository_repository_1.PostsRepository).to(postsRepository_repository_1.PostsRepository);
exports.container.bind(commentRepository_repository_1.CommentRepository).to(commentRepository_repository_1.CommentRepository);
exports.container.bind(blogsRepository_repository_1.BlogsRepository).to(blogsRepository_repository_1.BlogsRepository);
exports.container.bind(usersRepository_repository_1.UsersRepository).to(usersRepository_repository_1.UsersRepository);
exports.container.bind(authRepository_repository_1.AuthRepo).to(authRepository_repository_1.AuthRepo);
exports.container.bind(protectionRepo_repository_1.ProtectionRepo).to(protectionRepo_repository_1.ProtectionRepo);
//и на это вродее как всё. Самое главное прописать декоратор для класса и декораторы в конструкторе
//injectable - класс, который можно вставлять в контейнер и в другой класс
//inject - то, что обязательно нужно вставить внутрь конструктора класса
