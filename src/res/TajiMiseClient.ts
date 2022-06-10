import 'dotenv/config';
import firebaseAdmin from 'firebase-admin';
import { Client, Collection, Intents } from 'discord.js';

/**
 * TajiMiseClient app instance
 */
const TajiMiseClient = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
    ],
});

/**
 * properties
 */
TajiMiseClient.prefix = 'taji ';
TajiMiseClient.color = '#fca9cd';
TajiMiseClient.commands = new Collection();

/**
 * connect to firebase and attach to TajiMiseClient
 */
const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(JSON.parse(process.env.TAJIMISE_FIREBASE_SERVICE_ACCOUNT_SECRET!)),
});
TajiMiseClient.database = firebaseAdmin.firestore(firebaseApp);

export default TajiMiseClient;
