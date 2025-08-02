"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMeToView = mapMeToView;
function mapMeToView(user) {
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    };
}
