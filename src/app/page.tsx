
"use client";

import { useState, useEffect } from 'react';
import InputSection from '@/components/scriptify/input-section';
import OutputSection from '@/components/scriptify/output-section';
import { generateScript, type GenerateScriptInput, type GenerateScriptOutput } from '@/ai/flows/generate-script';
import { adjustScript, type AdjustScriptInput } from '@/ai/flows/adjust-script-flow';
import { DEFAULT_FORMAT, DEFAULT_STYLE, type VideoFormat, type VideoStyle } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";

// const initialScriptForDev: GenerateScriptOutput = {
//   hook: "Ever wondered how to make viral cat videos? 🙀",
//   scenes: [
//     {
//       text: "Scene 1: Find a cat. Preferably your own. If not, borrow one (with permission!).",
//       visualSuggestion: "Quick cuts of cute cats doing funny things. Zoom in on a cat's confused face."
//     },
//     {
//       text: "Scene 2: Add trending audio. Cats dancing to popular songs? Instant hit!",
//       visualSuggestion: "Show a phone screen scrolling through TikTok sounds, then a cat 'dancing' (wiggling)."
//     },
//     {
//       text: "Scene 3: Keep it short & snappy. Under 15 seconds is purrfect.",
//       visualSuggestion: "A timer counting down from 15 seconds rapidly. A cat yawning."
//     }
//   ],
//   cta: "Follow for more meow-sive tips! #CatVideos #ViralCats #TikTokTips"
// };


export default function HomePage() {
  const [topic, setTopic] = useState<string>('');
  const [format, setFormat] = useState<VideoFormat>(DEFAULT_FORMAT);
  const [style, setStyle] = useState<VideoStyle>(DEFAULT_STYLE);
  const [script, setScript] = useState<GenerateScriptOutput | null>(null);
  // const [script, setScript] = useState<GenerateScriptOutput | null>(initialScriptForDev); // For dev
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic is empty!",
        description: "Please enter a topic for your video.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setScript(null); 

    try {
      const input: GenerateScriptInput = { topic, format, style };
      const generatedScript = await generateScript(input);
      setScript(generatedScript);
      toast({
        title: "Script Generated! 🎉",
        description: "Your creative video script is ready.",
      });
    } catch (error) {
      console.error("Failed to generate script:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating your script. Please try again.",
        variant: "destructive",
      });
      setScript(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustScript = async (adjustmentRequest: string, currentScript: GenerateScriptOutput) => {
    if (!adjustmentRequest.trim()) {
      toast({
        title: "Adjustment request is empty!",
        description: "Please describe the changes you'd like to make.",
        variant: "destructive",
      });
      return;
    }
    if (!currentScript) {
      toast({
        title: "No script to adjust!",
        description: "Please generate a script first before requesting adjustments.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true); 

    try {
      const input: AdjustScriptInput = {
        originalScript: currentScript,
        adjustmentRequest,
      };
      const adjustedScript = await adjustScript(input);
      setScript(adjustedScript); 
      toast({
        title: "Script Adjusted! 🔄",
        description: "Your video script has been updated with your changes.",
      });
    } catch (error) {
      console.error("Failed to adjust script:", error);
      toast({
        title: "Uh oh! Adjustment failed.",
        description: "There was a problem adjusting your script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-foreground">Loading Scriptify...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="py-4 px-6 shadow-sm bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Scriptify
            </h1>
          </div>
          <Button variant="outline" onClick={() => { /* TODO: Implement Sign In */ toast({ title: "Sign In Clicked!", description: "Sign in functionality coming soon."}) }}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <InputSection
              topic={topic}
              setTopic={setTopic}
              format={format}
              setFormat={setFormat}
              style={style}
              setStyle={setStyle}
              onGenerate={handleGenerateScript}
              isLoading={isLoading}
            />
          </div>
          <div>
            <OutputSection 
              script={script} 
              isLoading={isLoading} 
              onAdjustScript={handleAdjustScript} 
            />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <p>&copy; {currentYear !== null ? currentYear : '2024'} Scriptify. Unleash your creativity!</p>
        <p className="text-xs">Powered by AI & Next.js</p>
      </footer>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

