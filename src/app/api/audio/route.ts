// app/api/audio/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  text: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

const VOICE_ID = 'gOkFV1JMCt0G0n9xmBwV';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const voiceSettings: VoiceSettings = {
      stability: 0.5,
      similarity_boost: 0.5,
    };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: body.text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: 'Text-to-speech conversion failed', 
          details: errorData.detail || 'Unknown error'
        },
        { status: response.status }
      );
    }

    // Get the audio data as a blob
    const audioBlob = await response.blob();
    
    // Return the audio blob with correct headers
    return new NextResponse(audioBlob, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBlob.size.toString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Text-to-speech error:', errorMessage);
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}