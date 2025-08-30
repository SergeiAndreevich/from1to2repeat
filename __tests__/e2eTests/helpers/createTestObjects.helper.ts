import {TypeBlog, TypeBlogInputModel} from "../../../src/Entity/Blogs/Blog.types";
import {Express} from "express";
import {TypePostInputModel} from "../../../src/Entity/Posts/Post.types";

export const testBlogExample:TypeBlogInputModel = {
    name: 'tesBlog',
    description: 'testBlogExample',
    websiteUrl: 'https://loc.ru'
}
export const testPostExample:TypePostInputModel = {
    title: 'test post',
    shortDescription: 'test description',
    content: 'test content',
    blogId: ''
}
export class TestBlog{
    name:string;
    description:string;
    websiteUrl:string;
    createdAt: Date;
    isMembership: boolean;

    // constructor(name:string, description:string, websiteUrl:string) {
    constructor(dto:TypeBlogInputModel) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
        this.createdAt = new Date();
        this.isMembership = true;
    }

}
