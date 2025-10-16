export type TypeAuthInputModel = {
    loginOrEmail: string;
    password: string;
}

export type TypeMeViewModel = {
    email: string;
    login:  string;
    userId: string;
}

export type TypeSessionModel = {
    userId: string;
    deviceId: string;
    ip: string;
    deviceName: string;
    lastActivity: Date;
    expiresAt: Date;
    revoked:  boolean;
}

export type TypeSessionInputData = {
    ip: string;
    deviceName: string;
}

export type TypeSessionUpdateModel = {
    userId: string;
    deviceId: string;
    lastActivity: Date;
    expiresAt: Date;
}

export type TypeSessionToViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;

}