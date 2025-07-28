export type TypeBlog ={
    name: string,
    description: string,
    websiteUrl:	string,
    createdAt: Date,
    isMembership: boolean
}

export type TypeBlogInputModel ={
    name: string,
    description: string,
    websiteUrl:	string
}

export type TypeBlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl:	string,
    createdAt: Date,
    isMembership: boolean
}

export type TypePostToBlogInputModel = {
    title: string,
    shortDescription: string,
    content: string
}