import {Request,Response} from "express";

export async function getPostsForSpecificBlogHandler(req:Request,res:Response) {
    const blogId = req.params.blogId;


}