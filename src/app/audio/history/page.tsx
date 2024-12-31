import { db } from "~/server/db";




export default async function AudioTable() {
    
    const audios = await db.query.audio.findMany({
        orderBy: (model, { desc }) => desc(model.id),
    });

    console.log(audios);
    
    return (
        <div className="p-4">
            <div className="flex flex-col gap-4">
                {audios.map((audio) => (
                    <div key={audio.id} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            
                            <div className="flex flex-col">
                                <div className="text-lg font-bold">
                                    {audio.id}
                                </div>
                                <div className="font-bold underline text-lm text-white">
                                    {audio.text}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {audio.url}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}