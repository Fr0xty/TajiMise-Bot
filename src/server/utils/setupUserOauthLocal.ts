import 'dotenv/config';
import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';

import { DiscordOauthReturnCredentials } from 'tajimise';
import TajiMiseClient from '../../res/TajiMiseClient.js';
import { discordGetIdentity } from './oauthWorkflow.js';
import { clearOauthCookies } from './UserOauthLocalHelper.js';

/**
 * give oauth cookies & save user into firebase
 */
export const createDiscordUserOauth = async (
    req: Request,
    res: Response,
    oauthCredentials: DiscordOauthReturnCredentials
): Promise<boolean> => {
    /**
     * get information to store
     */
    const userDiscordIdentity = await discordGetIdentity(oauthCredentials.access_token);

    /**
     * if invalid access token, return success = false
     */
    if (!userDiscordIdentity) return false;

    const discordUserDoc = TajiMiseClient.database.collection('users').doc('discord');
    const userDoc = (await discordUserDoc.get()).data()[userDiscordIdentity.id];
    /**
     * if first time signing in, create new document in database
     */
    if (!userDoc) {
        await discordUserDoc.set({
            [userDiscordIdentity.id]: {
                email: userDiscordIdentity.email,
            },
        });
    } else if (userDoc.email !== userDiscordIdentity.email) {
        /**
         * update email if changed
         */
        userDoc.email = userDiscordIdentity.email;
        await discordUserDoc.update({
            [userDiscordIdentity.id]: userDoc,
        });
    }

    /**
     * clear every cookie issued by us to be reissued
     */
    await clearOauthCookies(res);

    /**
     * stores which third party auth is being used (long-lived cookie)
     */
    res.cookie('strategy', 'discord', {
        httpOnly: true,
        signed: true,
        sameSite: true,
        // secure: true, // production setting: true
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
    });

    /**
     * oauth2.0 refresh token (long-lived cookie)
     */
    res.cookie('rt', JWT.sign(oauthCredentials.refresh_token, process.env.JWT_SECRET_KEY!), {
        httpOnly: true,
        signed: true,
        sameSite: true,
        // secure: true, // production setting: true
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
    });

    /**
     * oauth2.0 access token (session cookie)
     */
    res.cookie(
        'at',
        JWT.sign(
            {
                uid: userDiscordIdentity.id,
                access_token: oauthCredentials.access_token,
            },
            process.env.JWT_SECRET_KEY!
        ),
        {
            httpOnly: true,
            signed: true,
            sameSite: true,
            // secure: true, // production setting: true
        }
    );

    return true;
};
