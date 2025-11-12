import bcrypt from 'bcrypt';
// export const bcryptHelper = {
//     async gerenateHash(password:string, rounds: number):Promise<string>{
//         const hash = bcrypt.hash(password, rounds);
//         return hash
//     },
//     async isPasswordCorrect(password:string, passwordFromDB:string):Promise<boolean>{
//         return bcrypt.compare(password, passwordFromDB);
//     }
// }

export const bcryptHelper  ={
    async generateHash(password:string, rounds: number):Promise<string>{
        const hash = await bcrypt.hash(password, rounds);
        return hash
    },
    async isPasswordCorrect(password:string, passwordFromDB:string):Promise<boolean>{
        return await bcrypt.compare(password, passwordFromDB);
    }
}

