"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const SECRET_KEY = process.env.SECRET_KEY || 'hello';
// export const jwtHelper = {
//     generateAccessToken(userId:string){
//         return sign({userId}, SECRET_KEY, {expiresIn: '10s'} );
//     },
//     verifyToken(userToken: string):string | JwtPayload | null {
//         try{
//             return verify(userToken, SECRET_KEY);
//         }
//         catch(error) {
//             console.error(`In jwt middleware has dropped an error: ${error}`);
//             return  null
//         }
//     },
//
//     generateRefreshToken(userId: string) {
//         const deviceId = uuidv4();
//         const refreshToken = sign({userId:userId, deviceId: deviceId}, SECRET_KEY, {expiresIn: '20s'} );
//         return {refreshToken, deviceId}
//     },
//     updateRefreshToken(userId: string, deviceId: string) {
//         const refreshToken = sign({userId:userId, deviceId: deviceId}, SECRET_KEY, {expiresIn: '20s'} );
//         return {refreshToken, deviceId}
//     },
//     verifyRefreshToken(refreshToken: string):JwtPayload | null {
//         try{
//             return verify(refreshToken, SECRET_KEY) as JwtPayload;        }
//         catch(error) {
//             console.error(`In jwt middleware has dropped an error: ${error}`);
//             return  null
//         }
//     }
// }
class JwtHelper {
    generateAccessToken(userId) {
        return (0, jsonwebtoken_1.sign)({ userId }, SECRET_KEY, { expiresIn: '10s' });
    }
    verifyToken(userToken) {
        try {
            return (0, jsonwebtoken_1.verify)(userToken, SECRET_KEY);
        }
        catch (error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return null;
        }
    }
    generateRefreshToken(userId) {
        const deviceId = (0, uuid_1.v4)();
        const refreshToken = (0, jsonwebtoken_1.sign)({ userId: userId, deviceId: deviceId }, SECRET_KEY, { expiresIn: '20s' });
        return { refreshToken, deviceId };
    }
    updateRefreshToken(userId, deviceId) {
        const refreshToken = (0, jsonwebtoken_1.sign)({ userId: userId, deviceId: deviceId }, SECRET_KEY, { expiresIn: '20s' });
        return { refreshToken, deviceId };
    }
    verifyRefreshToken(refreshToken) {
        try {
            return (0, jsonwebtoken_1.verify)(refreshToken, SECRET_KEY);
        }
        catch (error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return null;
        }
    }
}
exports.jwtHelper = new JwtHelper();
