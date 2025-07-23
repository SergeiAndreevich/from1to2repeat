import {WithId} from "mongodb";
import {TypeUser, TypeUserViewModel} from "../../Entity/Users/User.types";

export function mapUserToView(user:WithId<TypeUser>):TypeUserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}