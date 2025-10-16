"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const SECRET_KEY = process.env.SECRET_KEY || 'hello';
exports.jwtHelper = {
    generateAccessToken(userId) {
        return (0, jsonwebtoken_1.sign)({ userId }, SECRET_KEY, { expiresIn: '10s' });
    },
    verifyToken(userToken) {
        try {
            return (0, jsonwebtoken_1.verify)(userToken, SECRET_KEY);
        }
        catch (error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return null;
        }
    },
    generateRefreshToken(userId) {
        const deviceId = (0, uuid_1.v4)();
        const refreshToken = (0, jsonwebtoken_1.sign)({ userId: userId, deviceId: deviceId }, SECRET_KEY, { expiresIn: '20s' });
        return { refreshToken, deviceId };
    },
    verifyRefreshToken(refreshToken) {
        try {
            return (0, jsonwebtoken_1.verify)(refreshToken, SECRET_KEY);
        }
        catch (error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return null;
        }
    }
};
