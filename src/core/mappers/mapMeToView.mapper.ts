import {TypeUser, TypeUserViewModel} from "../../Entity/Users/User.types";
import {TypeMeViewModel} from "../auth/auth.types";
import {WithId} from "mongodb";

export function mapMeToView(user:WithId<TypeUser>):TypeMeViewModel{
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    }
}