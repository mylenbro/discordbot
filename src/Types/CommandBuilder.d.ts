import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

type CommandBuilder =
    ContextMenuCommandBuilder |
    Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
