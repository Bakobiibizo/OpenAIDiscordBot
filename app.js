import { GatewayIntentBits, Client } from 'discord.js';
import 'dotenv/config';
import express, { response, text } from 'express';
import { OpenAIApi } from 'openai';
import { callOpenAI } from './openai.js';

import { VerifyDiscordRequest } from './utils.js';

const token = process.env.DISCORD_TOKEN;
const apId = process.env.API_ID;
const port = process.env.PORT;
const publicKey = process.env.PUBLIC_KEY;
const guildId = process.env.GUILD_ID;
const openai = new OpenAIApi(process.env.OPENAI_API_KEY);


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
        const gptResponse = await callOpenAI(message.content, message.author.username);
        console.log(gptResponse.data.choices[0].text);
        message.reply(gptResponse.data.choices[0].text);
        return;
    } catch (err) {
        console.log(err);
    }
});



client.login(token);