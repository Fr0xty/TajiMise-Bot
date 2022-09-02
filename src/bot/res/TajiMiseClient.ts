import 'dotenv/config';
import firebaseAdmin from 'firebase-admin';
import { Client, Collection, IntentsBitField } from 'discord.js';

/**
 * TajiMiseClient app instance
 */
const TajiMiseClient = new Client({
    intents: [
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildWebhooks,
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
