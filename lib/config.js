"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydraAdmin = void 0;
var hydra_client_1 = require("@oryd/hydra-client");
var baseOptions = {};
if (process.env.MOCK_TLS_TERMINATION) {
    baseOptions.headers = { 'X-Forwarded-Proto': 'https' };
}
var hydraAdmin = new hydra_client_1.AdminApi(new hydra_client_1.Configuration({
    basePath: process.env.HYDRA_ADMIN_URL,
    baseOptions: baseOptions
}));
exports.hydraAdmin = hydraAdmin;
