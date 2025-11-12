// import {Request, Response} from "express";
// import {httpStatus} from "../../types/httpStatuses.type";
// import {jwtHelper} from "../../helpers/jwt.helper";
// import {sessionsRepo} from "../../dataAcsessLayer/repository/sessionsRepository.repository";
//
// export async function getAllDevicesHandler(req:Request,res:Response){
//     //условие гуарда здесь валидный рефреш токен. И только!
//     //console.log("----------------Getting all devices");
//     const refreshToken = req.cookies.refreshToken;
//     if(!refreshToken){
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//     const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
//     if(!decodedRefresh){
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//     //console.log('IN DEVICES GET --- DECODED REFRESH TOKEN',decodedRefresh);
//
//     const sessions = await sessionsRepo.findSessionsByUserId(decodedRefresh.userId);
//     if(sessions.length < 1){
//         console.log('there is on one session in GET./devices')
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     //а вдруг он только зашел и хочет посмотреть, есть ли там что. Ну как минимум одно ведь должно же быть активно
//     //console.log('SESSIONS IN GET./devices', sessions);
//     res.status(httpStatus.Ok).send(sessions)
// }