import { CommandInteraction } from "discord.js";
import Bot from "../Bot.js";
import { CommandBuilder } from "../Types/CommandBuilder.js";

interface Command {
    data: CommandBuilder;
    execute: (bot: Bot, interaction: CommandInteraction) => Promise<void>;
}