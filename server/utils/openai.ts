import OpenAI from "openai";

export const useOpenAI = () => {
    const config = useRuntimeConfig()

    if (!config.openaiKey) {
        throw new Error("Missing OpenAI API Key in runtimeConfig");
    }

    return new OpenAI({
        apiKey: config.openaiKey
    });

}

export const assistant = "asst_PNa2ailIBfh4Hv0JyJA10wrD"