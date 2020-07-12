import bodyParser from "body-parser";
import cors from "cors"
import routes from "../api/routes-index.js"
import config from '../config/config.js';

export default (app) => {

    app.get("/status", (req, res) => { res.status(200).end() });
    app.head("/status", (req, res) => { res.status(200).end() });

    app.enable('trust proxy')

    app.use(cors())
    app.use(bodyParser.urlencoded({extended : false}));
    app.use(bodyParser.json())
    

    app.use(config.api.prefix, routes());

    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    /// error handlers
    app.use((err, req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
        return res
            .status(err.status)
            .send({ message: err.message })
            .end();
        }
        return next(err);
    });
    
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
                name: err.name,
                code: err.code
            },
        });
    });

}
