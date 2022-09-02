import TajiMiseClient from './res/TajiMiseClient.js';
import 'dotenv/config';
import fs from 'fs';

/**
 * loading event handlers
 */
const eventFiles = fs.readdirSync('./dist/bot/events');
eventFiles.forEach(async (eventFile) => {
    await import(`./events/${eventFile}`);
});
console.log('Events are successfully added!');

/**
 * loading commands
 */
const loadCommands = async () => {
    const commandCategoryFolders = fs.readdirSync('./dist/bot/commands');

    for (const categoryFolder of commandCategoryFolders) {
        const commandFiles = fs.readdirSync(`./dist/bot/commands/${categoryFolder}`);

        for (const file of commandFiles) {
            const { default: commandClass } = await import(`./commands/${categoryFolder}/${file}`);

            const command = new commandClass();
            TajiMiseClient.commands.set(command.name, command);

            if (command.aliases) {
                for (const alias of command.aliases) {
                    TajiMiseClient.commands.set(alias, command);
                }
            }
        }
    }
    console.log('Commands are successfully added!');
};

await loadCommands();

/**
 * login into client
 */
TajiMiseClient.login(process.env.TAJIMISE_CLIENT_TOKEN);
