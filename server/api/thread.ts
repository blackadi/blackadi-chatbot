import {assistant, useOpenAI} from '../utils/openai'
export default defineEventHandler(async (event) => {
    const queryParams = getQuery(event);

    const client = useOpenAI();

    const thread = await client.beta.threads.create();

    const run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant,
        additional_instructions: `The customer's name is ${queryParams.customer}`,
    })

    return {
        thread: thread.id,
        run: run.id
    }
});