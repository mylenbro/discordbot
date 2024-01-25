import { Message, MessageReaction, User } from 'discord.js';
import Bot from '../Bot.js';
import "../Extensions/Array";

class LinkHandler {
    reaction = ["🔧"];
    links = new Map<string, string>();

    constructor() {
        this.links.set("instagram.com", "ddinstagram.com")
        this.links.set("twitter.com", "vxtwitter.com")
        this.links.set("tiktok.com", "vxtiktok.com")
        this.links.set("youtube.com/shorts/", "youtube.com/watch?v=")
        this.links.set("pixiv.net", "phixiv.net")
    }

    async onMessageCreate(bot: Bot, msg: Message) {
        const keys = Array.from(this.links.keys());
        const content = msg.content
        const key = keys.find((item: string) => content.includes(item));
        if (key == undefined) return;
        const messageReaction = await this.sendReaction(bot, msg)
        this.waitForAuthor(bot, msg, messageReaction, key)
    }

    private waitForAuthor(bot: Bot, message: Message, messageReaction: MessageReaction, key: string): void {
        const filter = (reaction: MessageReaction, user: User) => {
            const emoji = this.reaction.find(r => reaction.emoji.name === r) !== undefined
            const author = user.id === message.author.id
            return emoji && author;
        };

        const collector = message.createReactionCollector({ filter, max: 1, time: 30000 });
        collector.on('collect', async _ => {
            const linkFromUser = this.getLinkFromString(message.content, key);
            const linkFixed = this.links.get(key) ?? "";
            let content = linkFromUser.replaceAll(key, linkFixed)
            const date = new Date()
            if (date.getDate() === 1 && ((date.getMonth() + 1) == 4 && (Math.floor(Math.random() * 100)) <= 10))
                content = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            try {
                await bot.reply(message, content, false)
                await message.suppressEmbeds()
            } catch (error: any) {
                await bot.showError(message, error)
            }
        });

        collector.on('end', async _ => {
            await messageReaction
                .remove()
                .catch(error => console.error(error));
        });
    }

    private sendReaction(bot: Bot, msg: Message): Promise<MessageReaction> {
        const emoji = this.reaction.random()
        return bot.react(msg, emoji);
    }

    private getLinkFromString(post: string, link: string): string {
        return post
            .trim()
            .replaceAll('\n', ' ')
            .split(' ')
            .filter(element => element.includes(link))[0] ?? ''
    }

}

export default LinkHandler