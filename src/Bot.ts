import { Client, GatewayIntentBits, Collection, ActivityType, Message, EmojiIdentifierResolvable, Interaction, TextChannel, StageChannel, MessageReaction, VoiceBasedChannel, CommandInteraction, VoiceState, CategoryChannel, PartialGroupDMChannel, ForumChannel } from "discord.js";
import LinkHandler from './MessageHandlers/LinkHandler.js';
import fs from 'fs';
import { Command } from "./Interfaces/Command.js";

class Bot {
    private client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions
        ]
    });

    private linkHandler = new LinkHandler();
    private commands = new Collection<string, Command>();

    async init(token: string) {
        this.bindEvents(this.client);
        await this.loadCommands();
        this.client.login(token);
    }

    private async loadCommands() {
        this.commands = new Collection();
        const commandFiles = fs.readdirSync(`./build/Commands`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandModule = await import(`./Commands/${file}`);
            const command = commandModule.default.default;
            const commandInstance: Command = new command();
            this.commands.set(commandInstance.data.name, commandInstance)
        }
    }

    private bindEvents(client: Client) {
        client.on("ready", () => this.onReady());
        client.on("messageCreate", msg => this.onMessageCreate(msg));
        client.on("interactionCreate", i => this.onInteractionCreate(i));
        client.on("voiceStateUpdate", (o, n) => this.onVoiceStateUpdate(o, n))
        client.on('warn', info => console.log(`warn: ${info}`));
        client.on('error', error => console.error(`client's WebSocket encountered a connection error: ${error}`));
    }

    private onReady() {
        console.log("Hacker voice: \"I'm in.\"");
        // this.client.user?.setStatus("invisible")
        this.client.user?.setActivity({ name: '', type: ActivityType.Streaming, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    }

    private onMessageCreate(msg: Message) {
        if (msg.author.bot) {
            return;
        }
        this.linkHandler.onMessageCreate(this, msg);
    }

    private async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const command = this.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(this, interaction);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: `${error}`, ephemeral: true });
        }
    }

    private onVoiceStateUpdate(o: any, n: any) {
        const oldState: VoiceState = o
        const newState: VoiceState = n
        const someoneLeft = oldState.channel && !newState.channel
        if (someoneLeft) {
            const hasMembers = oldState.channel.members.size > 1
            if (!hasMembers) {

            }
        }
    }

    public async getVoiceChannel(interaction: CommandInteraction): Promise<VoiceBasedChannel> {
        const guild = await interaction.guild?.fetch();
        const member = await guild?.members.fetch(interaction.user.id);
        const vchannel = member?.voice.channel
        if (vchannel === undefined || vchannel === null) {
            throw `Connect to a voice channel and try again.`
        }
        return vchannel
    }

    onUnhandledRejection(error: any) {
        console.error('Unhandled promise rejection:', error);
    }

    reply(previousMessage: Message, content: string, mention = true): Promise<Message> {
        const message = { content, "allowedMentions": { "repliedUser": mention } };
        return previousMessage.reply(message)
    }

    send(channel: TextChannel, message: string): Promise<Message> {
        return channel.send(message)
    }

    react(message: Message, emoji: EmojiIdentifierResolvable): Promise<MessageReaction> {
        return message.react(emoji)
    }

    async showError(message: Message | null, error: Error) {
        console.log(error);
        let channel = message?.channel
        // if (channel === null || channel === undefined) {
        //     const channelCache = await this.client.channels.fetch('public github')
        //     if (channelCache === null ||
        //         channelCache instanceof CategoryChannel ||
        //         channelCache instanceof PartialGroupDMChannel ||
        //         channelCache instanceof ForumChannel)
        //         return
        //     channel = channelCache
        // }
        if (channel instanceof StageChannel) return;
        channel?.send({
            content: `**${error.name}**\n${error.message}`
        });
    }

    delete(message: Message): Promise<Message<boolean>> {
        return message.delete()
    }

    exit() {
        this.client.destroy();
    }
}

export default Bot