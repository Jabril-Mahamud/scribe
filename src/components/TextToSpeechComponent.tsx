'use client'
import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Volume2, Languages, Loader2, RefreshCw, PlayCircle } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [volume, setVolume] = useState(1);
  const [needsGeneration, setNeedsGeneration] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Clear previous audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle text changes
  const handleTextChange = (newText: string) => {
    setText(newText);
    setNeedsGeneration(true);
    // Clear existing audio when text changes
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl('');
    }
  };

  // Handle volume changes
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0];
    }
  };

  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError('');
    setNeedsGeneration(false);

    try {
      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to convert text to speech');
      }

      // Clean up old audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlayCircle className="w-6 h-6" />
          Text to Speech Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Selection Hint */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Languages className="w-4 h-4" />
          <span>You can enter text in any language</span>
        </div>

        {/* Text Input Area */}
        <div role="region" aria-label="Text input section">
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="h-32 text-lg leading-relaxed"
            aria-label="Text to convert to speech"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : undefined}
          />
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4" role="region" aria-label="Volume control">
          <Volume2 className="w-4 h-4" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.1}
            aria-label="Adjust volume"
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleTextToSpeech}
            disabled={isLoading || !text.trim() || !needsGeneration}
            className="w-40"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : needsGeneration ? (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Generate Audio
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription id="error-message">{error}</AlertDescription>
          </Alert>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div 
            role="region" 
            aria-label="Audio player"
            className="bg-muted p-4 rounded-lg"
          >
            <audio 
              ref={audioRef}
              controls 
              className="w-full" 
              aria-label="Generated speech audio"
              preload="metadata"
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Help Text */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Enter text in any language</li>
            <li>Use the slider to adjust volume</li>
            <li>Click Generate Audio to convert your text</li>
            <li>The audio player will appear below once generated</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}