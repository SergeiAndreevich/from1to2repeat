import {TypeUserViewModel} from "../../Entity/Users/User.types";
import {JwtPayload, sign, verify} from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";


const SECRET_KEY = process.env.SECRET_KEY || 'hello';

export const jwtHelper = {
    async createToken(user: TypeUserViewModel):Promise<string> {
        const data = {userId: user.id}
        return sign(data, SECRET_KEY,{expiresIn: '1h'} );
    },
    async verifyToken(userToken: string):Promise<string | JwtPayload | null> {
        try{
            return verify(userToken, SECRET_KEY);
        }
        catch(error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return  null
        }
    },
    async generateAccessToken(userId:string){
        return sign({userId}, SECRET_KEY, {expiresIn: '10s'} );
    },
    async generateRefreshToken(userId: string) {
        const jti = uuidv4();
        const refreshToken = sign({userId, jti}, SECRET_KEY, {expiresIn: '20s'} );
        return {refreshToken, jti}
    },
    async verifyRefreshToken(refreshToken: string):Promise<JwtPayload | null> {
        try{
            return verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;        }
        catch(error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return  null
        }

    }
}