"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var url_1 = __importDefault(require("url"));
var url_join_1 = __importDefault(require("url-join"));
var csurf_1 = __importDefault(require("csurf"));
var config_1 = require("../config");
// Sets up csrf protection
var csrfProtection = csurf_1.default({ cookie: true });
var router = express_1.default.Router();
router.get('/', csrfProtection, function (req, res, next) {
    // Parses the URL query
    var query = url_1.default.parse(req.url, true).query;
    // The challenge is used to fetch information about the logout request from ORY Hydra.
    var challenge = String(query.logout_challenge);
    if (!challenge) {
        next(new Error('Expected a logout challenge to be set but received none.'));
        return;
    }
    config_1.hydraAdmin
        .getLogoutRequest(challenge)
        // This will be called if the HTTP request was successful
        .then(function () {
        // Here we have access to e.g. response.subject, response.sid, ...
        // The most secure way to perform a logout request is by asking the user if he/she really want to log out.
        res.render('logout', {
            csrfToken: req.csrfToken(),
            challenge: challenge,
            action: url_join_1.default(process.env.BASE_URL || '', '/logout')
        });
    })
        // This will handle any error that happens when making HTTP calls to hydra
        .catch(next);
});
router.post('/', csrfProtection, function (req, res, next) {
    // The challenge is now a hidden input field, so let's take it from the request body instead
    var challenge = req.body.challenge;
    if (req.body.submit === 'No') {
        return (config_1.hydraAdmin
            .rejectLogoutRequest(challenge)
            .then(function () {
            // The user did not want to log out. Let's redirect him back somewhere or do something else.
            res.redirect('https://www.ory.sh/');
        })
            // This will handle any error that happens when making HTTP calls to hydra
            .catch(next));
    }
    // The user agreed to log out, let's accept the logout request.
    config_1.hydraAdmin
        .acceptLogoutRequest(challenge)
        .then(function (_a) {
        var body = _a.data;
        // All we need to do now is to redirect the user back to hydra!
        res.redirect(String(body.redirect_to));
    })
        // This will handle any error that happens when making HTTP calls to hydra
        .catch(next);
});
exports.default = router;
