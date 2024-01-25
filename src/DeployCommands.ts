require('dotenv').config();
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPostAPIContextMenuApplicationCommandsJSONBody, Routes } from "discord.js";
import fs from 'fs';
import { Command } from "./Interfaces/Command";

const commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody> = [];
const commandFiles = fs.readdirSync('./build/Commands').filter(file => file.endsWith('.js'));

const clientId = process.env.CLIENT ?? "";
const guildId = process.env.GUILD ?? "";
const token = process.env.DISCORD ?? "";
const isDev = (process.env.DEV !== undefined) ? (process.env.DEV == "0") ? false : true : false;

async function fill() {
	for (const file of commandFiles) {
		const commandModule = await import(`./Commands/${file}`);
		const command = commandModule.default.default;
		const commandInstance: Command = new command();
		commands.push(commandInstance.data.toJSON());
	}
}

async function deploy() {
	const rest = new REST({ version: '10' }).setToken(token);
	try {
		console.log(isDev ? `Dev` : 'Prod')
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const request = isDev ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId)
		const data: any = await rest.put(
			request,
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}

}

async function deleteCommands() {
	const rest = new REST().setToken(token);
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
		.then(() => console.log('Successfully deleted all guild commands.'))
		.catch(console.error);
}

async function start() {
	await fill();
	await deploy();
}

// deleteCommands()

start()