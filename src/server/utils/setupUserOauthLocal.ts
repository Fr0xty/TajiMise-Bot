import 'dotenv/config';
import { Request, Response } from 'express';

import { DiscordOauthReturnCredentials } from 'tajimise';
import TajiMiseClient from '../../res/TajiMiseClient.js';
import { discordGetIdentity } from './oauthWorkflow.js';
import { setAccessTokenCookie, setLoginCheckCookie, setRefreshTokenCookie, setStrategyCookie } from './setCookies.js';
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

    await setStrategyCookie(res, 'discord');
    await setRefreshTokenCookie(res, oauthCredentials.refresh_token);
    await setAccessTokenCookie(res, { uid: userDiscordIdentity.id, access_token: oauthCredentials.access_token });
    await setLoginCheckCookie(res);

    return true;
};
