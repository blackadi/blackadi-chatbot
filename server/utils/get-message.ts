import {useOpenAI} from './openai'

export const getLatestMessages = async (threadID: string, runID: string) => {
    const client = useOpenAI();

    let run = await client.beta.threads.runs.retrieve(runID, {thread_id: threadID});

    while(run.status != "completed") {
        await new Promise((resolve) => setTimeout(resolve, 500));

        run = await client.beta.threads.runs.retrieve(runID, {thread_id: threadID});
    }

    return await client.beta.threads.messages.list(threadID);
}