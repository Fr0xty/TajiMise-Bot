import 'dotenv/config';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { DiscordOauthReturnCredentials, DiscordIdentity } from 'tajimise';

/**
 *takes code given by Discord and exchange for OAuth2.0 tokens via Discord's API.
 * @param code 'code' url query parameter provided by Discord
 * @returns OAuth credentials returned by Discord's API, null if failed
 */
export const discordExchangeCodeForToken = async (code: string): Promise<DiscordOauthReturnCredentials | null> => {
    const requestForm = new URLSearchParams({
        client_id: process.env.TAJIMISE_CLIENT_ID!,
        client_secret: process.env.TAJIMISE_CLIENT_SECRET!,
        redirect_uri: process.env.DISCORD_OAUTH_REDIRECT_URI!,
        grant_type: 'authorization_code',
        code,
    });

    const tokenReq = await fetch(`${process.env.DISCORD_BASE_API_URL}/oauth2/token`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestForm,
    });

    if (tokenReq.status !== 200) return null;
    return (await tokenReq.json()) as DiscordOauthReturnCredentials;
};

/**
 * uses user's access token to fetch identity
 * @param accessToken the user's oauth access token
 * @returns identity payload returned by /users/@me endpoint
 */
export const discordGetIdentity = async (accessToken: string): Promise<DiscordIdentity | null> => {
    const identityReq = await fetch(`${process.env.DISCORD_BASE_API_URL}/users/@me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (identityReq.status !== 200) return null;
    return (await identityReq.json()) as DiscordIdentity;
};

/**
 * exchange refresh token for a new access token response
 * @param refreshToken user's discord oauth refresh token
 * @returns access token response
 */
export const discordRefreshToken = async (refreshToken: string): Promise<DiscordOauthReturnCredentials | null> => {
    const refreshReq = await fetch(`${process.env.DISCORD_BASE_API_URL}/oauth2/token`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.TAJIMISE_CLIENT_ID!,
            client_secret: process.env.TAJIMISE_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });

    if (refreshReq.status !== 200) return null;
    return (await refreshReq.json()) as DiscordOauthReturnCredentials;
};
