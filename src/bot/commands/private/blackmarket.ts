import { BaseCommand } from 'tajimise';
import { Message, MessageEmbed } from 'discord.js';
import TajiMiseClient from '../../res/TajiMiseClient.js';

export default class blackmarket implements BaseCommand {
    name: String;
    description: String;

    constructor() {
        this.name = 'blackmarket';
        this.description = 'get access into the blackmarket.';
    }

    async execute(msg: Message, args: string[]) {
        if (msg.guildId !== '969467742811979836') return;
        await msg.member!.roles.add((await msg.guild!.roles.fetch('972827455104622664'))!);

        const embed = new MessageEmbed()
            .setTitle('Welcum to the blackmarket!')
            .setColor('#353b66')
            .setDescription(
                `
    You got access to purchace a whole new category of our products. You should see a category called <#972828142572036176>. Feel free to use the channels provided.
                `
            )
            .setFooter({ text: 'By the TajiMise Team.', iconURL: TajiMiseClient.user!.displayAvatarURL() });

        await msg.author.send({ embeds: [embed] });
        await msg.delete();
    }
}
