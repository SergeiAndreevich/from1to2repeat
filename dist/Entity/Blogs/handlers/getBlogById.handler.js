"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export async function getBlogByIdHandler(req: Request, res: Response) {
//     const  blogId = req.params.id;
//     const blog = await queryRepo.findBlogByIdOrFail(blogId);
//     //отработали 404
//     if(blog === null) {
//         console.log(blog)
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     res.status(httpStatus.Ok).send(blog);
// }
//400 если не прошел валидацию
//остается 404 и 200
