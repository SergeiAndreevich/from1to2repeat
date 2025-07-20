export type TypeUser = {
    login: string,
    email: string,
    password: string,
    createdAt: Date
}

export type TypeUserInputModel = {
    login: string,
    email: string,
    password: string
}

export type TypeUserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}