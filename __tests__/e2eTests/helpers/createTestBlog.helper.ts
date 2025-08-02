import {TypeBlog, TypeBlogInputModel} from "../../../src/Entity/Blogs/Blog.types";
import {Express} from "express";

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
