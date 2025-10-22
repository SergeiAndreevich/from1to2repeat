export type TypeUser = {
    login: string,
    email: string,
    password: string,
    createdAt: Date
}
class User {
    constructor(public login: string, public email: string, public password: string, public createdAt: Date) {
        this.login = login;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }
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
class UserExtended {
    constructor(
        public accountData:{
            login: string,
            email: string,
            password: string,
            createdAt: Date
        },
        public emailConfirmation:{
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean
        }
    ){

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