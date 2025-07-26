import {TypeUserViewModel} from "../../Entity/Users/User.types";
import {JwtPayload, sign, verify} from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || 'hello';

export const jwtHelper = {
    async createToken(user: TypeUserViewModel):Promise<string> {
        const data = {id: user.id}
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
    }
}