export type TypePost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId:	string,
    blogName: string,
    createdAt: Date
}

export type TypePostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId:	string
}

export type TypePostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId:	string,
    blogName: string,
    createdAt: Date
}

export type TypeBlogPostInputModel = {
    title: string,
    shortDescription: string,
    content: string
}