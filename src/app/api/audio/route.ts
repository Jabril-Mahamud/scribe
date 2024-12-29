import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        voices: [{
            id: 1,
            name: "Jorge",
            image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            voice: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            
        },{
            id:2,
            name: "James",
            image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            voice: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        }],
    })
}