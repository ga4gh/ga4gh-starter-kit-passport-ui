"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var morgan_1 = __importDefault(require("morgan"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = __importDefault(require("./routes"));
var login_1 = __importDefault(require("./routes/login"));
var logout_1 = __importDefault(require("./routes/logout"));
var consent_1 = __importDefault(require("./routes/consent"));
var app = express_1.default();
// view engine setup (view engine maps HTML templates to routes)
app.set('views', path_1.default.join(__dirname, '..', 'views')); // setting where are the views located
app.set('view engine', 'pug'); // default engine is .pug files
// uncomment after placing your favicon in /public
var favicon = require('serve-favicon');
app.use(favicon(path_1.default.join(__dirname, 'public', 'favicon.ico')));
// app.use('/favicon.ico', express.static('images/favicon.ico'));
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', routes_1.default); // the base page
app.use('/login', login_1.default);
app.use('/logout', logout_1.default);
app.use('/consent', consent_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(new Error('Not Found'));
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('error', {
        message: JSON.stringify(err, null, 2)
    });
});
var listenOn = Number(process.env.PORT || 3000);
app.listen(listenOn, function () {
    console.log("Listening on http://0.0.0.0:" + listenOn);
});
