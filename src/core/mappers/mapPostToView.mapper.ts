import {WithId} from "mongodb";
import {TypePost, TypePostViewModel} from "../../Entity/Posts/Post.types";

export function mapPostToView(post:WithId<TypePost>):TypePostViewModel{
    return{
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}