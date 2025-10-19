import {NextFunction, Request, Response} from 'express';
import {protectionService} from "./BLL/protectionService.bll";
import {ResultStatuses} from "../types/ResultObject.type";
import {httpStatus} from "../types/httpStatuses.type";

export async function antiClicker (req: Request, res: Response, next: NextFunction): Promise<void> {
    //получаем IP и URL
    const IP = req.ip || req.socket.remoteAddress || 'unknown';
    const URL = req.originalUrl || req.baseUrl;
    //// Используем метод + путь для большей гранулярности
    //const endpoint = `${req.method} ${req.baseUrl}${req.path}`;
    // Для тестирования можно добавить логирование
    console.log(`Rate limit check: IP=${IP}, URL=${URL}`);

    const result = await protectionService.checkClicks(IP, URL);
    if(result.status !== ResultStatuses.success) {
        res.sendStatus(httpStatus.TooManyRequests);
        return
    }
    next();

}