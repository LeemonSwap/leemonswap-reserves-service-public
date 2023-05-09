import { NextFunction, Request, Response } from 'express';
import * as Sentry from "@sentry/node";


export const sentryCustom = (req: Request, res: Response, next: NextFunction ) => {
    Sentry.configureScope(scope => scope.setTransactionName("TESTRANDOM"));
    return next()
}
