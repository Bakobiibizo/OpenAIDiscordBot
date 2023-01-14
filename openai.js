import "dotenv/config";

import OpenAI from "openai-api";


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY? OPENAI_API_KEY : '');

 export async function callOpenAI (prompt, username) {
    const gptResponse = await openai.complete({
        engine: 'text-davinci-003',
        prompt: `Chat GPT is a friendly chat bot\n
        ChatGPT: Hello! I hope you're doing well today! How can I help you? \n
        ${username}: ${prompt} \n
        ChatGPT:`,
        maxTokens: 3933,
        temperature: 0.9,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["ChatGPT:",`${username}:`]
    });

    console.log(gptResponse);
    return gptResponse;

};
