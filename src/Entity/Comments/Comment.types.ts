export type TypeComment = {
    content: string,
    commentatorInfo: TypeCommentatorInfo,
    createdAt: Date,
    postId:string
}

export type TypeCommentatorInfo = {
    userId: string,
    userLogin: string
}

export type TypeCommentInputModel = {
    content: string
}

export type TypeCommentViewModel = {
    id: string,
    content: string,
    commentatorInfo: TypeCommentatorInfo,
    createdAt: Date
}