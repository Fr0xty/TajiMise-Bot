import 'dotenv/config';
import { Response } from 'express';

/**
 * clear every cookie issued by us
 * @param res express response object
 */
export const clearOauthCookies = async (res: Response) => {
    const options = {
        path: '/',
        domain: process.env.FULL_DOMAIN,
    };

    res.clearCookie('rt', options);
    res.clearCookie('at', options);
    res.clearCookie('strategy', options);
};
