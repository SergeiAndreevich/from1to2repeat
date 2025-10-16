"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSessionToView = mapSessionToView;
function mapSessionToView(sessions) {
    return {
        ip: sessions.ip,
        title: sessions.deviceName,
        lastActiveDate: sessions.lastActivity.toISOString(),
        deviceId: sessions.deviceId
    };
}
