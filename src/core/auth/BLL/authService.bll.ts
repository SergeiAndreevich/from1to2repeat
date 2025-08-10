import {TypeAuthInputModel} from "../auth.types";
import {queryRepo} from "../../dataAcsessLayer/queryRepo.repository";
import {IResult, ResultStatuses} from "../../types/ResultObject.type";
import {TypeUserViewModel} from "../../../Entity/Users/User.types";
import {jwtHelper} from "../../helpers/jwt.helper";
import {nullThrows} from "@typescript-eslint/eslint-plugin/dist/util";

export const authService = {
    async checkUserInfo(info: TypeAuthInputModel):Promise<IResult<string | null>>{
        const {loginOrEmail, password} = info;
        const doesUserExist = await queryRepo.findUserByAuthOrFail(loginOrEmail, password);
        if(doesUserExist.status === ResultStatuses.success){
            return {
                data: await jwtHelper.createToken(doesUserExist.data!),
                status: doesUserExist.status
            }
        }
        return {
            data: null,
            status: doesUserExist.status
        }
    }
}