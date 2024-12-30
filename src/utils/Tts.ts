import { ElevenLabsClient } from "elevenlabs";


export async function TextToSpeechService(request: Req){


    const client = new ElevenLabsClient({ apiKey: "YOUR_API_KEY" });
    await client.textToSpeech.convertAsStream("JBFqnCBsd6RMkjVDRZzb", {
        output_format: "mp3_44100_128",
        text: "The first move is what sets everything in motion.",
        model_id: "eleven_multilingual_v2"
    });
}