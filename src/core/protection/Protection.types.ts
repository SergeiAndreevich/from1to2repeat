import {add} from "date-fns";

export type TypeRateLimitModel = {
    IP: string;
    //endpoint: string;
    URL: string;
    date: Date;
}

export type TypeRecoveryPasswordModel = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}
