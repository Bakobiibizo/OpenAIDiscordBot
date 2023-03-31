import "dotenv/config";
import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID;

const configuration = new Configuration({
    organization: OPENAI_ORG_ID,
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const callOpenAI = app.post('/', async (req, res) => {
    try {

        const prompt = req.body.prompt;


        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: "user",
                content: `This is the context of our conversation:
                ${req.body.context}`
            }, {
                role: "assistant",
                content: "Great, how can I help you today?"
            }, {
                role: "user",
                content: `${prompt}`
            }],
            max_tokens: 4000,
            stop: ["User:", "AI:"],
            temperature: 0.9,
        });
        console.log(response.data);
        let content = JSON.stringify(response.data.choices[0].message);
        writeToFile(content, filename);
        tokenTracker.updatePromptTokens(response.data.usage?.prompt_tokens);
        tokenTracker.updateCompletionTokens(response.data.usage?.completion_tokens);
        tokenTracker.printTokenUsage();

        console.log(tokenTracker.completionTokens);

        //collect response and send it back to the client
        res.status(200).send({
            bot: response.data.choices[0].message
        });
        //catch errors
    } catch (error) {

        console.error(error);
        res.status(500).send({ error });
    }
});