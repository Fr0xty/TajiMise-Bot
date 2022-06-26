import 'dotenv/config';
import { Request, Response } from 'express';

import { DiscordOauthReturnCredentials } from 'tajimise';
import TajiMiseClient from '../../res/TajiMiseClient.js';
import { discordGetIdentity } from './oauthWorkflow.js';
import { setAccessTokenCookie, setLoginCheckCookie, setRefreshTokenCookie, setStrategyCookie } from './setCookies.js';
import { clearOauthCookies } from './UserOauthLocalHelper.js';

/**
 * give oauth cookies & save user into firebase
 * @param req Express request object
 * @param res Express response object
 * @param oauthCredentials Discord user oauth credentials
 * @returns register user successful
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

    const discordUsersDoc = TajiMiseClient.database.collection('users').doc('discord');
    const allDiscordUsersDocData = (await discordUsersDoc.get()).data();
    const registeringUserDocData = allDiscordUsersDocData[userDiscordIdentity.id];

    /**
     * if first time signing in, create new document in database
     */
    if (!registeringUserDocData) {
        allDiscordUsersDocData[userDiscordIdentity.id] = {
            email: userDiscordIdentity.email,
        };

        await discordUsersDoc.update(allDiscordUsersDocData);
    } else if (registeringUserDocData.email !== userDiscordIdentity.email) {
        /**
         * update email if changed
         */
        allDiscordUsersDocData[userDiscordIdentity.id].email = userDiscordIdentity.email;

        await discordUsersDoc.update(allDiscordUsersDocData);
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
