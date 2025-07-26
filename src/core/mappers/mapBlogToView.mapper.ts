import {WithId} from "mongodb";
import {TypeBlog, TypeBlogViewModel} from "../../Entity/Blogs/Blog.types";

export function mapBlogToView(blog: WithId<TypeBlog>):TypeBlogViewModel{
    return{
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}