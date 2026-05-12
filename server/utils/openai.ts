import OpenAI from "openai";

export const useOpenAI = defineEventHandler((event) => {
    const config = useRuntimeConfig(event)

    return new OpenAI({
        apiKey: config.openaiKey
    });
})

export const assistant = "asst_PNa2ailIBfh4Hv0JyJA10wrD"