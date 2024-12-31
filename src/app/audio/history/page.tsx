// File: app/audio/history/page.tsx
import { getMyAudio } from "~/server/queries";
import { AudioTableClient } from "../../_components/AudioTableClient";

export default async function AudioHistoryPage() {
    const audios = await getMyAudio();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <div className="p-6 w-full max-w-3xl bg-white shadow-xl rounded-lg">
                <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
                    Your Audio History
                </h1>
                <AudioTableClient audios={audios} />
            </div>
        </div>
    );
}
