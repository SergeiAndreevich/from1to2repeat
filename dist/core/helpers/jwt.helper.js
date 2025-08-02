"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || 'hello';
exports.jwtHelper = {
    createToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { id: user.id };
            return (0, jsonwebtoken_1.sign)(data, SECRET_KEY, { expiresIn: '1h' });
        });
    },
    verifyToken(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (0, jsonwebtoken_1.verify)(userToken, SECRET_KEY);
            }
            catch (error) {
                console.error(`In jwt middleware has dropped an error: ${error}`);
                return null;
            }
        });
    }
};
