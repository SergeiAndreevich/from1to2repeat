export type TypeUser = {
    login: string,
    email: string,
    password: string,
    createdAt: Date
}

export type TypeUserExtended = {
    accountData:{
        login: string,
        email: string,
        password: string,
        createdAt: Date
    },
    emailConfirmation:{
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
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