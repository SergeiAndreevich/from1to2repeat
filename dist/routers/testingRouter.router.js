"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const httpStatuses_type_1 = require("../core/types/httpStatuses.type");
const repository_repository_1 = require("../core/dataAcsessLayer/repository.repository");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter
    .delete('/all-data', async (req, res) => {
    await repository_repository_1.repository.removeAllData();
    res.sendStatus(httpStatuses_type_1.httpStatus.NoContent);
});
