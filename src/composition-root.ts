import "reflect-metadata";
import {QueryRepo} from "./core/dataAcsessLayer/queryRepo.repository";
import {BlogsController} from "./routers/blogsRouter.router";
import {BlogsService} from "./Entity/Blogs/BLL/blogsService.bll";
import {BlogsRepository} from "./core/dataAcsessLayer/repository/blogsRepository.repository";
import {PostsRepository} from "./core/dataAcsessLayer/repository/postsRepository.repository";
import {CommentsController} from "./routers/commentsRouter.router";
import {CommentService} from "./Entity/Comments/BLL/commentService.bll";
import {commentRepository, CommentRepository} from "./core/dataAcsessLayer/repository/commentRepository.repository";
import {PostsController} from "./routers/postsRouter.router";
import {PostsService} from "./Entity/Posts/BLL/postsService.bll";
import {SecurityController} from "./routers/securityDevices.router";
import {SessionsRepo} from "./core/dataAcsessLayer/repository/sessionsRepository.repository";
import {SessionsService} from "./core/auth/BLL/sessionsService.bll";
import {UsersController} from "./routers/usersRouter.router";
import {UsersService} from "./Entity/Users/BLL/usersService.bll";
import {Container} from "inversify";
import {AuthController} from "./classes/auth";
import {UsersRepository} from "./core/dataAcsessLayer/repository/usersRepository.repository";
import {AuthRepo} from "./core/dataAcsessLayer/repository/authRepository.repository";
import {AuthService} from "./core/auth/BLL/authService.bll";

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
export const container = new Container();

container.bind(UsersController).to(UsersController);
container.bind(SecurityController).to(SecurityController);
container.bind(PostsController).to(PostsController);
container.bind(CommentsController).to(CommentsController);
container.bind(BlogsController).to(BlogsController);
container.bind(AuthController).to(AuthController);

container.bind(UsersService).to(UsersService);
container.bind(SessionsService).to(SessionsService);
container.bind(PostsService).to(PostsService);
container.bind(CommentService).to(CommentService);
container.bind(BlogsService).to(BlogsService);
container.bind(AuthService).to(AuthService);

container.bind(QueryRepo).to(QueryRepo);
container.bind(SessionsRepo).to(SessionsRepo);
container.bind(PostsRepository).to(PostsRepository);
container.bind(CommentRepository).to(CommentRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(AuthRepo).to(AuthRepo);

//и на это вродее как всё. Самое главное прописать декоратор для класса и декораторы в конструкторе
//injectable - класс, который можно вставлять в контейнер и в другой класс
//inject - то, что обязательно нужно вставить внутрь конструктора класса