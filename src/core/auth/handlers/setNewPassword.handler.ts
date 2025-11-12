// import {Request, Response} from 'express';
// import {httpStatus} from "../../types/httpStatuses.type";
// import {authService} from "../BLL/authService.bll";
// import {ResultStatuses} from "../../types/ResultObject.type";
//
// export async function setNewPasswordHandler(req: Request, res: Response): Promise<void> {
//     //забираем данные из боди
//     const input = req.body;
//     //отдаем в сервис и говорим "обнови"
//     const result = await authService.setNewPassword(input.newPassword, input.recoveryCode);
//     //получаем результат
//     if(result.status !== ResultStatuses.success) {
//         res.sendStatus(httpStatus.BadRequest);
//         return
//     }
//     res.sendStatus(httpStatus.NoContent)
// }