import {NextFunction, Request, Response} from 'express';
import {ResultStatuses} from "../types/ResultObject.type";
import {httpStatus} from "../types/httpStatuses.type";
import {container} from "../../composition-root";
import {ProtectionService} from "./BLL/protectionService.bll";

const protectionService = container.get(ProtectionService);
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