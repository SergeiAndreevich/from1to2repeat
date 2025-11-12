"use strict";
// import {Request, Response} from 'express';
// import {sessionsService} from "../BLL/sessionsService.bll";
// import {httpStatus} from "../../types/httpStatuses.type";
// import {ResultStatuses} from "../../types/ResultObject.type";
// import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
//
// export async function removeThisSessionHandler(req:Request, res: Response) {
//     const deviceId = req.params.deviceId;
//     const session = await queryRepo.findSession(deviceId);
//     if(!session) {
//         res.sendStatus(httpStatus.NotFound);
//         return
//     }
//     const refreshToken = req.cookies.refreshToken;
//     if(!refreshToken) {
//         res.sendStatus(httpStatus.Unauthorized);
//         return
//     }
//     const result = await sessionsService.removeThisSession(session, refreshToken);
//
//     switch (result.status) {
//         case ResultStatuses.forbidden:
//             res.sendStatus(httpStatus.Forbidden)
//             return
//         case ResultStatuses.unauthorized:
//             res.sendStatus(httpStatus.Unauthorized)
//             return
//         case ResultStatuses.success:
//             res.sendStatus(httpStatus.NoContent)
//             return
//         case ResultStatuses.notFound:
//             res.sendStatus(httpStatus.NotFound)
//             return
//         default:
//             res.sendStatus(httpStatus.InternalServerError)
//             return
//     }
// }
