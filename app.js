import { GatewayIntentBits, Client } from 'discord.js';
import 'dotenv/config';
import express from 'express';

import { callOpenAI } from './openai.js';

import { VerifyDiscordRequest } from './utils.js';

import { ContextWindow } from './contextWindow.js';

const contextWindow = new ContextWindow();

const token = process.env.DISCORD_TOKEN;
const port = process.env.PORT;



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
});

const app = express();

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



client.on('ready', () => {
    console.log(`Logged in and ready as ${client.user.tag}`);
});

client.on('messageCreate', async function (message) {
    try {
        if(message.author.bot) return;

        const tokens = message.content.split(' ');
        contextWindow.addTokens(tokens);

        const last1000Tokens = contextWindow.getContext();

        const gptResponse = await callOpenAI(last1000Tokens + " " + message.content, message.author.username);
        console.log(gptResponse.data.choices[0].text);
        message.reply(gptResponse.data.choices[0].text);
        return;
    } catch (err) {
        console.log(err);
    }
});



client.login(token);