import {Router, Response, Request} from 'express';
import {httpStatus} from "../core/types/httpStatuses.type";
import {repository} from "../core/dataAcsessLayer/repository.repository";

export const testingRouter = Router({});

testingRouter
    .delete('/all-data', async (req: Request, res: Response) => {
        await repository.removeAllData()
        res.sendStatus(httpStatus.NoContent)
    })

