// @ts-check
import 'dotenv/config'
import Bot from './Bot.js';
import HealthChecker from './Util/HealthChecker.js';

const healthChecker = new HealthChecker()
healthChecker.start();

const bot = new Bot();

function exit() {
    bot.exit();
    healthChecker.stop()
    process.exitCode = 0;
}

process
    .on('SIGINT', s => exit())
    .on('SIGTERM', s => exit())
    .on('unhandledRejection', error => bot.onUnhandledRejection(error));

const token = process.env.DISCORD
if (token)
    bot.init(token);