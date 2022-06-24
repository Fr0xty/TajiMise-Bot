import { Snowflake } from 'discord.js';

declare module 'tajimise' {
    export interface DiscordOauthReturnCredentials {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
        token_type: string;
    }

    export interface DiscordIdentity {
        id: Snowflake;
        username: string;
        avatar: string | null;
        avatar_decoration: any;
        discriminator: string;
        public_flags: number;
        flags: number;
        banner: string | null;
        banner_color: string | null;
        accent_color: number | null;
        locale: string;
        mfa_enabled: boolean;
        email: string | null;
        verified: boolean;
    }

    export interface APIResourceProfileRouteReturn {
        name: string;
        avatarURL: string | null;
        email?: string | null;
        strategy?: 'discord' | 'google';
    }
}
