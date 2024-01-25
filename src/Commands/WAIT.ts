require('dotenv').config();
import { EmbedBuilder, ContextMenuCommandBuilder, CommandInteraction } from 'discord.js';
import Bot from '../Bot.js';
import { Command } from '../Interfaces/Command.js';

class WAIT implements Command {
	data = new ContextMenuCommandBuilder()
		.setName('What anime is this')
		.setType(3)
		.setDMPermission(false)

	async execute(bot: Bot, interaction: CommandInteraction): Promise<void> {
		const link = this.getURLFromInteraction(interaction);
		if (link === undefined) {
			await interaction.reply({ content: 'Image doko? Video doko?', ephemeral: true });
			return;
		}
		await interaction.deferReply();
		const json = await this.fetchAnime(link)
		const content = this.formatResponse(json)
		interaction.editReply(content)
	}

	private getURLFromInteraction(interaction: CommandInteraction): string | undefined {
		const data = interaction.options.data[0]
		if (data == undefined) return undefined;
		const message = data.message
		if (message == undefined) return undefined
		let link;
		if (message.attachments !== null && message.attachments.size >= 1) {
			link = message.attachments.entries().next().value[1].url;
		} else if (message.embeds !== null && message.embeds.length > 0) {
			const embed = message.embeds[0]!;
			switch (embed.data.type) {
				case 'video':
				case 'image': link = embed.url; break;
				case 'rich': link = embed.image?.url; break;
				case 'gifv': link = embed.video?.url; break;
				default: console.log(embed.data.type);
			}
		}
		return link;
	}

	private async fetchAnime(image: string): Promise<Record<string, any>> {
		const response = await fetch(`https://api.trace.moe/search?url=${encodeURIComponent(image)}`);
		const animeJSON: Record<string, any> = await response.json();
		return animeJSON;
	}

	private formatResponse(r: Record<string, any>): Record<string, any> {
		const error: string = r["error"];
		if (error !== '') {
			throw error;
		}
		const content: Record<string, any> = {}
		const embed = new EmbedBuilder();

		const result: Array<Record<string, any>> = r["result"]
		if (result.length == 0) {
			embed.setDescription('Not found')
		} else {
			const data = result[0]!;
			const filename: string = data["filename"]
			const anilist: string = data["anilist"]
			const episode: string = data["episode"]
			const similarity: number = data["similarity"]
			const video: string = data["video"]
			embed
				.setDescription(`[${filename}](https://anilist.co/anime/${anilist})`)
				.addFields(
					{ name: 'Episode', value: `${episode}`, inline: true },
					{ name: 'Similarity', value: `${Number(similarity * 100).toFixed(2)}%`, inline: true },
				)
			content.files = [{ attachment: video, name: filename }];
		}
		content.embeds = [embed];
		return content;
	}

}

export default WAIT