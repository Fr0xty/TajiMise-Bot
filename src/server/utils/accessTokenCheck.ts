import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { decryptedAccessToken } from 'tajimise';

/**
 * access token check
 */
export const accessTokenCheck = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.signedCookies['at'] || !req.signedCookies['strategy']) return res.sendStatus(401);
    try {
        req.accessToken = JWT.verify(req.signedCookies['at'], process.env.JWT_SECRET_KEY!) as decryptedAccessToken;
        return next();
    } catch {
        /**
         * tampered access token: reset session
         */
        res.sendStatus(401);
    }
};
