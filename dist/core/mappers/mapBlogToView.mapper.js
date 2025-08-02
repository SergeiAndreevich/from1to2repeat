"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBlogToView = mapBlogToView;
function mapBlogToView(blog) {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}
