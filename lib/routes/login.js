"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var url_1 = __importDefault(require("url"));
var url_join_1 = __importDefault(require("url-join"));
var csurf_1 = __importDefault(require("csurf"));
const { Console } = require("console");
var config_1 = require("../config");
var oidc_cert_1 = require("./stub/oidc-cert");
// Sets up csrf protection
var csrfProtection = csurf_1.default({ cookie: true });
var router = express_1.default.Router();
router.get('/', csrfProtection, function (req, res, next) {
    // Parses the URL query
    var query = url_1.default.parse(req.url, true).query;
    // The challenge is used to fetch information about the login request from ORY Hydra.
    var challenge = String(query.login_challenge);
    if (!challenge) {
        next(new Error('Expected a login challenge to be set but received none.'));
        return;
    }
    config_1.hydraAdmin
        .getLoginRequest(challenge)
        .then(function (_a) {
        var _b;
        var body = _a.data;
        // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
        // the user.
        if (body.skip) {
            // You can apply logic here, for example update the number of times the user logged in.
            // ...
            // Now it's time to grant the login request. You could also deny the request if something went terribly wrong
            // (e.g. your arch-enemy logging in...)
            return config_1.hydraAdmin
                .acceptLoginRequest(challenge, {
                // All we need to do is to confirm that we indeed want to log in the user.
                subject: String(body.subject)
            })
                .then(function (_a) {
                var body = _a.data;
                // All we need to do now is to redirect the user back to hydra!
                res.redirect(String(body.redirect_to));
            });
        }
        // If authentication can't be skipped we MUST show the login UI.
        res.render('login', {
            csrfToken: req.csrfToken(),
            challenge: challenge,
            action: url_join_1.default(process.env.BASE_URL || '', '/login'),
            hint: ((_b = body.oidc_context) === null || _b === void 0 ? void 0 : _b.login_hint) || ''
        });
    })
        // This will handle any error that happens when making HTTP calls to hydra
        .catch(next);
});
router.post('/', csrfProtection, function (req, res, next) {
    // The challenge is now a hidden input field, so let's take it from the request body instead
    var challenge = req.body.challenge;
    // Let's see if the user decided to accept or reject the consent request..
    if (req.body.submit === 'Deny access') {
        // Looks like the consent request was denied by the user
        return (config_1.hydraAdmin
            .rejectLoginRequest(challenge, {
            error: 'access_denied',
            error_description: 'The resource owner denied the request'
        })
            .then(function (_a) {
            var body = _a.data;
            // All we need to do now is to redirect the browser back to hydra!
            res.redirect(String(body.redirect_to));
        })
            // This will handle any error that happens when making HTTP calls to hydra
            .catch(next));
    }
    // Let's check if the user provided valid credentials. Of course, you'd use a database or some third-party service
    // for this!
    if (!(req.body.email === 'foo@ga4gh.org' && req.body.password === 'foobar')) {
        // Looks like the user provided invalid credentials, let's show the ui again...
        Console.log("Logged in, csrfToken: " + req.csrfToken() + "\n");
        
        res.render('login', {
            csrfToken: req.csrfToken(),
            challenge: challenge,
            error: 'The username / password combination is not correct'
        });
        return;
    }
    // Seems like the user authenticated! Let's tell hydra...
    config_1.hydraAdmin
        .getLoginRequest(challenge)
        .then(function (_a) {
        var loginRequest = _a.data;
        return config_1.hydraAdmin
            .acceptLoginRequest(challenge, {
            // Subject is an alias for user ID. A subject can be a random string, a UUID, an email address, ....
            subject: 'foo@ga4gh.org',
            // This tells hydra to remember the browser and automatically authenticate the user in future requests. This will
            // set the "skip" parameter in the other route to true on subsequent requests!
            remember: Boolean(req.body.remember),
            // When the session expires, in seconds. Set this to 0 so it will never expire.
            remember_for: 3600,
            // Sets which "level" (e.g. 2-factor authentication) of authentication the user has. The value is really arbitrary
            // and optional. In the context of OpenID Connect, a value of 0 indicates the lowest authorization level.
            // acr: '0',
            //
            // If the environment variable CONFORMITY_FAKE_CLAIMS is set we are assuming that
            // the app is built for the automated OpenID Connect Conformity Test Suite. You
            // can peak inside the code for some ideas, but be aware that all data is fake
            // and this only exists to fake a login system which works in accordance to OpenID Connect.
            //
            // If that variable is not set, the ACR value will be set to the default passed here ('0')
            acr: oidc_cert_1.oidcConformityMaybeFakeAcr(loginRequest, '0')
        })
            .then(function (_a) {
            var body = _a.data;
            // All we need to do now is to redirect the user back to hydra!
            res.redirect(String(body.redirect_to));
        });
    })
        // This will handle any error that happens when making HTTP calls to hydra
        .catch(next);
    // You could also deny the login request which tells hydra that no one authenticated!
    // hydra.rejectLoginRequest(challenge, {
    //   error: 'invalid_request',
    //   errorDescription: 'The user did something stupid...'
    // })
    //   .then(({body}) => {
    //     // All we need to do now is to redirect the browser back to hydra!
    //     res.redirect(String(body.redirectTo));
    //   })
    //   // This will handle any error that happens when making HTTP calls to hydra
    //   .catch(next);
});
exports.default = router;
