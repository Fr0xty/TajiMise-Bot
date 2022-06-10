import { Collection } from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        prefix: string;
        color: ColorResolvable;
        commands: Collection;
        database: FirebaseFirestore;
    }
}
