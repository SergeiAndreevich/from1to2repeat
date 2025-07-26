import bcrypt from 'bcrypt';
export const bcryptHelper = {
    async gerenateHash(password:string, rounds: number):Promise<string>{
        const hash = bcrypt.hash(password, rounds);
        return hash
    },
    async isPasswordCorrect(password:string, passwordFromDB:string):Promise<boolean>{
        return bcrypt.compare(password, passwordFromDB);
    }
}