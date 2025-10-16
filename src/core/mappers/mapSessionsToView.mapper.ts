import {WithId} from "mongodb";
import {TypeSessionModel, TypeSessionToViewModel} from "../auth/auth.types";

export function mapSessionToView(sessions:TypeSessionModel):TypeSessionToViewModel {
    return {
        ip: sessions.ip,
        title: sessions.deviceName,
        lastActiveDate: sessions.lastActivity.toISOString(),
        deviceId: sessions.deviceId
    }
}