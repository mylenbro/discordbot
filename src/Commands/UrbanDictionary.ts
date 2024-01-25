require('dotenv').config();
import { EmbedBuilder, CommandInteraction, SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, CacheType, StringSelectMenuInteraction, UserSelectMenuInteraction, RoleSelectMenuInteraction, MentionableSelectMenuInteraction, ChannelSelectMenuInteraction } from 'discord.js';
import Bot from '../Bot.js';
import UrbanTerm from '../Classes/UrbanTerm.js';
import { Command } from '../Interfaces/Command.js';
import UrbanService from '../Services/UrbanService.js';

class UrbanDictionary implements Command {
    data = new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Searches the urban dictionary')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('The term you want to find')
                .setRequired(true))
        .setDMPermission(false)


    async execute(bot: Bot, interaction: CommandInteraction): Promise<void> {
        await interaction.deferReply();
        const term = interaction.options.data[0]?.value?.toString()
        if (term === undefined) return

        const terms = await UrbanService.get(term)
        const message = this.getMessage(terms)
        await interaction.editReply(message)
    }

    private getMessage(terms: UrbanTerm[]) {
        const message: Record<string, any> = {}
        message.embeds = this.getEmbeds(terms);
        return message
    }

    private getEmbeds(terms: UrbanTerm[]) {
        const embed = new EmbedBuilder()
        const term = terms.sort((a, b) => { return (b.thumbsUp - a.thumbsUp) }).shift()
        if (term !== undefined) {
            embed.setTitle(term.word)
            embed.setDescription(term.definition + `\`\`\`${term.example}\`\`\``)
            embed.setURL(term.permalink)
            embed.setTimestamp(new Date(term.writtenOn))
            embed.setFooter({ text: `By ${term.author}` })
            embed.setAuthor({ name: 'Urban Dictionary', url: 'https://urbandictionary.com' })
        }
        return [embed]
    }

}

export default UrbanDictionary