// import {Request,Response} from "express";
// import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
// import {httpStatus} from "../../types/httpStatuses.type";
// import {usersService} from "../../../Entity/Users/BLL/usersService.bll";
//
// export async function resendConfirmationHandler(req:Request, res: Response) {
//     const { email } = req.body; // достаём строку email
//     //console.log('=== RESEND CONFIRMATION DEBUG ===');
//     //console.log('1. Email received:', email);
//
//     const userEmail = await queryRepo.checkEmailConfirmation(email);
//     //console.log('2. checkEmailConfirmation result:', userEmail);
//
//     if(!userEmail) {
//         //console.log('3. ❌ Returning 400 - user not found or already confirmed');
//         res.status(httpStatus.BadRequest).send({
//             errorsMessages: [
//                 {
//                     "message": "bad request",
//                     "field": "email"
//                 }
//             ]
//         });
//         return
//     }
//     //Проблема:
//     //В вашем коде после пункта 4 нет кода для:
//     //-Генерации нового confirmation code
//     //-Обновления пользователя в базе с новым кодом
//     //-Отправки email с новым кодом
//     const result = await usersService.updateConfirmationCode(email)
//     //console.log('4. ✅ Sending new confirmation email');
//     res.sendStatus(httpStatus.NoContent)
//     //204 отсылаем код подтверждения (единственное не совсем понятно, типа, юзер уже существует в БД)
//     //ну и 400 если некорректная почта или уже подтверждена
// }
