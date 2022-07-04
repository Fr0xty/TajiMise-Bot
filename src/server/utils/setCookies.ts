import 'dotenv/config';
import JWT from 'jsonwebtoken';
import { Response } from 'express';

/**
 * stores which third party auth is being used (long-lived cookie)
 * @param res
 * @param strategy third party oauth provider
 */
export const setStrategyCookie = async (res: Response, strategy: 'discord') => {
    res.cookie('strategy', strategy, {
        httpOnly: true,
        signed: true,
        sameSite: true,
        // secure: true, // production setting: true
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
    });
};

/**
 * set oauth refresh token (long-lived cookie)
 * @param res express response object
 * @param refreshToken oauth refresh token
 */
export const setRefreshTokenCookie = async (res: Response, refreshToken: string) => {
    res.cookie('rt', JWT.sign(refreshToken, process.env.JWT_SECRET_KEY!), {
        httpOnly: true,
        signed: true,
        sameSite: true,
        // secure: true, // production setting: true
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
    });
};

/**
 * set oauth access token (session cookie)
 * @param res express response object
 * @param credentials oauth acess token and user id
 */
export const setAccessTokenCookie = async (res: Response, credentials: { uid: string; access_token: string }) => {
    res.cookie('at', JWT.sign(credentials, process.env.JWT_SECRET_KEY!), {
        httpOnly: true,
        signed: true,
        sameSite: true,
        // secure: true, // production setting: true
    });
};

/**
 * non httponly cookie for client to know if user is logged in
 * @param res express response object
 */
export const setLoginCheckCookie = async (res: Response) => {
    res.cookie('logged_in', 'yo', {
        sameSite: true,
        signed: true,
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
        // secure: true, // production setting: true
    });
};

/**
 * store preferred language in a locale cookie
 * @param res express response object
 * @param languageCode supported ISO 639-1 standard language code
 */
export const setLocaleCookie = async (res: Response, languageCode: string) => {
    res.cookie('locale', languageCode, {
        sameSite: true,
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
        // secure: true, // production setting: true
    });
};
