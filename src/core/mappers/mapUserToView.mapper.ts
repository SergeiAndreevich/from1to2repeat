import {WithId} from "mongodb";
import {TypeUser, TypeUserExtended, TypeUserViewModel} from "../../Entity/Users/User.types";

export function mapUserToView(user:WithId<TypeUserExtended>):TypeUserViewModel {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}