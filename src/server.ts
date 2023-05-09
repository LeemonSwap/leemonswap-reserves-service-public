import 'express-async-errors';
import * as Sentry from '@sentry/node';
import * as colors from 'colors/safe';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as passport from 'passport';

import AggregatorRouter from './router/aggregator';

import BackendError, { handleError } from './utils/backendError';
import { isDevelopment, isTest } from './utils/env';
import { sentryCustom } from './utils/middleware';

const environment: string = process.env.NODE_ENV || 'dev';
const mongoDbUri: string = process.env.MONGODB_URI || 'mongodb://localhost/leemonswap';
const env = process.env.NODE_ENV;
const sentryDsn = process.env.SENTRY_DSN;

// Server class
class Server {
    public app: express.Application

    constructor() {
        this.app = express();

        this.config();
        this.routes();
    }

    public config() {
        // setup mongoose
        // const options: any = { useNewUrlParser: true, useUnifiedTopology: true };

        // mongoose.connect(mongoDbUri, options, (err: any) => {
        //     if(err) {
        //         console.log(err);
        //         throw err;
        //     }

        //     console.log('connected to mongodb');
        // });

        // Cors
        this.app.use(cors());
    
        // setup passport
        this.app.use(passport.initialize());

        // config
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ limit: '10mb', extended: true }));
        this.app.use(helmet());

        // adding context
        this.app.use(sentryCustom);

        if(environment !== 'production') {this.app.use(logger('dev'));}
        
        this.app.use(compression());
        
        // Starting
        let startMessage = `${colors.rainbow(`[Cluster ${process.pid}] `) + colors.green('online')} environment: ${colors.green(environment)}`;
        startMessage += ' mongo_address: ';


        if(env !== 'dev') {
            startMessage += colors.green('[hidden]');
        }
        else {
            startMessage += colors.green(mongoDbUri);
        }
        
        // tslint:disable-next-line:no-console
        console.log(startMessage);
    }

    public routes(): void {
        const router: express.Router = express.Router();
        
        this.app.use('/', router);
        this.app.use('/aggregator', AggregatorRouter.router);
        

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof BackendError) {
                if(err.reportToSentry) { 
                    Sentry.withScope(scope => {
                        const sentryError = '';

                        if(req.user) {
                            scope.setUser({ id: req.user._id.toString() });
                        }

                        if(err.additional) { 
                            scope.setContext('additionals', err.additional);
                        }
                    
                        scope.addEventProcessor(async event => { return Sentry.Handlers.parseRequest(event, req); });

                        Sentry.captureException(err);
                        handleError(err.message, req, res, err.reportToSentry, err.additional, Sentry.lastEventId());
                    });
                }
                else {
                    handleError(err.message, req, res, err.reportToSentry, err.additional);
                }
                
            } 
            else {
                if (isDevelopment || isTest) {
                    console.log(err);
                }

                handleError('Generic', req, res);
            }
        });
    }
}

export default new Server().app;
