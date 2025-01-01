// app/audio/history/page.tsx
import { getMyAudio } from "~/server/queries";
import { AudioTableClient } from "../../_components/AudioTableClient";

export default async function AudioHistoryPage() {
    const audios = await getMyAudio();

    return (
        <div className="p-6 w-full max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">
                Your Audio History
            </h1>
            <AudioTableClient audios={audios} />
        </div>
    );
}