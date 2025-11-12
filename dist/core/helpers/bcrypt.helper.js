"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptHelper = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// export const bcryptHelper = {
//     async gerenateHash(password:string, rounds: number):Promise<string>{
//         const hash = bcrypt.hash(password, rounds);
//         return hash
//     },
//     async isPasswordCorrect(password:string, passwordFromDB:string):Promise<boolean>{
//         return bcrypt.compare(password, passwordFromDB);
//     }
// }
exports.bcryptHelper = {
    async generateHash(password, rounds) {
        const hash = await bcrypt_1.default.hash(password, rounds);
        return hash;
    },
    async isPasswordCorrect(password, passwordFromDB) {
        return await bcrypt_1.default.compare(password, passwordFromDB);
    }
};
