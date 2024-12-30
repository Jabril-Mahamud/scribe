import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { getMyAudio } from "~/server/queries";
import { AudioWaveform } from "lucide-react";

type Audio = {
    id: number;
    text: string;
    url: string;
    createdAt: Date;
};

export default async function AudioTable() {
    const audioFiles = await getMyAudio();
    
    return (
        <div className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Transcription</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {audioFiles.map((audio: Audio) => (
                        <TableRow key={audio.id}>
                            <TableCell className="flex items-center gap-2">
                                <AudioWaveform className="h-4 w-4" />
                                {audio.text}
                            </TableCell>
                            <TableCell>{audio.text}</TableCell>
                            <TableCell>{audio.createdAt.toLocaleString()}</TableCell>
                            <TableCell>
                                <a
                                    href={audio.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Download
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}