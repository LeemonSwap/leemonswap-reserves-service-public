import { Request, Response } from 'express';
import type { Query } from 'mongoose';

const environment: string = process.env.NODE_ENV || 'dev';

export type ValidErrors =
    | 'Generic'
    | 'Invalid'
    | 'InvalidCursor'
    | 'Already'
    | 'NoBalance'
    
export async function tryWithCustomError<T extends Promise<any> | Query<any, any, any> = any> (f : T, error : ValidErrors) : Promise<T> {
    try {
        const result = await f;
        return result;
    }
    catch {
        throw new BackendError(error);
    }
}

export const handleError = (message: string, req: Request, res: Response, shouldReport = false, additionalInfo?: Record<string, any>, sentryId?: string) => {
    if (shouldReport === true) {
        return res.status(400).json({ error: message, errorId: sentryId });
    } 
        return res.status(400).json({ error: message });
    
};

/*
 * Backend error extends a javascript error
 *
 * it can be used as a normal error :
 *
 * throw new BackendError("Invalid")
 *
 * it provides some additional fields that can be used with google
 *
 */
class BackendError extends Error {
    private _reportToSentry: boolean
    private _additional: Record<string, any>

    constructor(message: ValidErrors, reportToSentry = false, additional: Record<string, any> = {}) {
        super(message);
        this._reportToSentry = reportToSentry;
        this._additional = additional;
    }
    get reportToSentry(): boolean {
        return this._reportToSentry;
    }
    get additional(): Record<string, any> {
        return this._additional;
    }
}

export default BackendError;
