import { Message, MessageEmbed } from 'discord.js';

import TajiMiseClient from '../../res/TajiMiseClient.js';
import { BaseCommand } from 'tajimise';
import CommandArgument from '../../res/CommandArgument.js';

export default class evaluate implements BaseCommand {
    name: String;
    description: String;
    commandUsage: String;
    args: CommandArgument[];

    constructor() {
        this.name = 'eval';
        this.description = 'run code in discord.';
        this.commandUsage = '<script>';
        this.args = [
            new CommandArgument({ type: 'paragraph' }).setName('script').setDescription('javascript code to run.'),
        ];
    }

    async execute(msg: Message, args: string[]) {
        let [script] = args;
        script = script.trim();

        if (msg.author.id !== '395587171601350676') return;
        if (script.startsWith('```') && script.endsWith('```')) script = script.replace(/(^.*?\s)|(\n.*$)/g, '');

        try {
            // @ts-ignore
            let result = eval(`
(async () => {
    const { default: TajiMiseClient } = await import('../../res/TajiMiseClient.js');
    
    try {
        ${script}
    } catch (err) {
        await msg.reply(String(err));
    }
})();
            `);
        } catch (err) {
            console.log(err);
            // @ts-ignore
            await msg.reply(err.message);
        }
    }
}
