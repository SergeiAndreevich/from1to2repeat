import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../../../src/core/auth/basicGuard.middleware";

// export function createBearer(){
//         const
// }

export function basicToken(){
    const base64pass = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');
    return `Basic ${base64pass}`
}