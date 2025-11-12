"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export async function logoutHandler(req: Request, res: Response): Promise<void> {
//     // check actual token
//     const refreshToken = req.cookies.refreshToken;
//     console.log(`Refreshing token in LOGOUT ${refreshToken}`);
//     if(!refreshToken) {
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//     // вносим изменения в БД, т.е. протухаем существующий токен
//     const result = await authService.removeRefreshToken(refreshToken);
//     //проверяем статус того че пришло из БД
//     if(result.status !== ResultStatuses.success){
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//
//     //очищаем куки и возвращаем ответочку
//     res.clearCookie("refreshToken");
//     res.sendStatus(httpStatus.NoContent)
// }
