"use strict";
// This file contains logic which is used when running this application as part of the
// OpenID Connect Conformance test suite. You can use it for inspiration, but please
// do not use it in production as is.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oidcConformityMaybeFakeSession = exports.oidcConformityMaybeFakeAcr = void 0;
exports.oidcConformityMaybeFakeAcr = function (request, fallback) {
    var _a;
    if (process.env.CONFORMITY_FAKE_CLAIMS !== '1') {
        return fallback;
    }
    return ((_a = request.oidc_context) === null || _a === void 0 ? void 0 : _a.acr_values) &&
        request.oidc_context.acr_values.length > 0
        ? request.oidc_context.acr_values[request.oidc_context.acr_values.length - 1]
        : fallback;
};
exports.oidcConformityMaybeFakeSession = function (grantScope, request, session) {
    if (process.env.CONFORMITY_FAKE_CLAIMS !== '1') {
        return session;
    }
    var idToken = {};
    // If the email scope was granted, fake the email claims.
    if (grantScope.indexOf('email') > -1) {
        // But only do so if the email was requested!
        idToken.email = 'foo@bar.com';
        idToken.email_verified = true;
    }
    // If the phone scope was granted, fake the phone claims.
    if (grantScope.indexOf('phone') > -1) {
        idToken.phone_number = '1337133713371337';
        idToken.phone_number_verified = true;
    }
    // If the profile scope was granted, fake the profile claims.
    if (grantScope.indexOf('profile') > -1) {
        idToken.name = 'Foo Bar';
        idToken.given_name = 'Foo';
        idToken.family_name = 'Bar';
        idToken.website = 'https://www.ory.sh';
        idToken.zoneinfo = 'Europe/Belrin';
        idToken.birthdate = '1.1.2014';
        idToken.gender = 'robot';
        idToken.profile = 'https://www.ory.sh';
        idToken.preferred_username = 'robot';
        idToken.middle_name = 'Baz';
        idToken.locale = 'en-US';
        idToken.picture =
            'https://raw.githubusercontent.com/ory/web/master/static/images/favico.png';
        idToken.updated_at = 1604416603;
        idToken.nickname = 'foobot';
    }
    // If the address scope was granted, fake the address claims.
    if (grantScope.indexOf('address') > -1) {
        idToken.address = {
            country: 'Localhost',
            region: 'Intranet',
            street_address: 'Local Street 1337'
        };
    }
    return {
        access_token: session.access_token,
        id_token: __assign(__assign({}, idToken), session.id_token)
    };
};
