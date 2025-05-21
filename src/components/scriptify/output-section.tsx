
"use client";

import { FC, useState } from 'react';
import SceneCard from './scene-card';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, FileDown, ThumbsUp, Film, MessageSquareHeart, PencilLine, XCircle, RefreshCw } from "lucide-react";
import type { GenerateScriptOutput } from '@/ai/flows/generate-script';
import { useToast } from "@/hooks/use-toast";

interface OutputSectionProps {
  script: GenerateScriptOutput | null;
  isLoading: boolean;
  onAdjustScript: (adjustmentRequest: string, currentScript: GenerateScriptOutput) => void;
}

const OutputSection: FC<OutputSectionProps> = ({ script, isLoading, onAdjustScript }) => {
  const { toast } = useToast();
  const [showAdjustmentInput, setShowAdjustmentInput] = useState(false);
  const [adjustmentRequest, setAdjustmentRequest] = useState("");

  const handleCopyScript = () => {
    if (!script) return;
    const scriptText = `Hook:\n${script.hook}\n\nScenes:\n${script.scenes
      .map((scene, index) => `Scene ${index + 1}:\nText: ${scene.text}\nVisual: ${scene.visualSuggestion}`)
      .join('\n\n')}\n\nCTA:\n${script.cta}`;
    
    navigator.clipboard.writeText(scriptText)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Your video script is ready to be pasted.",
          variant: "default", 
        });
      })
      .catch(err => {
        console.error("Failed to copy script: ", err);
        toast({
          title: "Copy Failed",
          description: "Could not copy script to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleExportPdf = () => {
    toast({
      title: "Export to PDF (Coming Soon!)",
      description: "This feature is not yet implemented.",
    });
    console.log("Export to PDF clicked");
  };

  const handleSubmitAdjustment = () => {
    if (!script) return;
    if (!adjustmentRequest.trim()) {
      toast({
        title: "Adjustment text is empty",
        description: "Please describe what you want to change.",
        variant: "destructive",
      });
      return;
    }
    onAdjustScript(adjustmentRequest, script);
    // setShowAdjustmentInput(false); // Keep open to see loading state, or hide: user preference
    // setAdjustmentRequest(""); 
  };
  
  if (isLoading && !script) {
     return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <Skeleton className="h-8 w-1/2 bg-muted-foreground/30" />
            <div className="flex space-x-2">
                <Skeleton className="h-10 w-24 bg-muted-foreground/20 rounded-md" />
                <Skeleton className="h-10 w-28 bg-muted-foreground/20 rounded-md" />
            </div>
        </div>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="shadow-lg border-border/70">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/4 bg-muted-foreground/30" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full bg-muted-foreground/20" />
              <Skeleton className="h-4 w-3/4 bg-muted-foreground/20" />
              <div className="mt-3 pt-3 border-t border-border/50">
                <Skeleton className="h-4 w-1/2 bg-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!script && !isLoading) {
    return (
      <div className="text-center py-10">
        <Film className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Your generated script will appear here.</p>
        <p className="text-sm text-muted-foreground/80">Fill in the details and click "Generate Script" to start!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-primary drop-shadow-sm">
          {isLoading && script ? "Updating Script..." : (script ? "Your Viral Script! 🎬" : "Output")}
        </h2>
        {script && (
          <div className="flex space-x-2 flex-wrap gap-2">
            <Button onClick={handleCopyScript} variant="outline" className="shadow-md hover:bg-accent/20" disabled={isLoading}>
              <Copy className="mr-2 h-4 w-4" /> Copy Script
            </Button>
            <Button onClick={handleExportPdf} variant="outline" className="shadow-md hover:bg-accent/20" disabled={isLoading}>
              <FileDown className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        )}
      </div>

      {isLoading && script && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
              <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-primary font-medium">Applying your adjustments...</p>
          </div>
      )}

      {script && (
        <div className={`space-y-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <SceneCard title="The Hook ✨" text={script.hook} icon={<ThumbsUp className="mr-2 h-5 w-5 text-green-500" />} />
          {script.scenes.map((scene, index) => (
            <SceneCard
              key={index}
              title={`Scene ${index + 1} 🎞️`}
              text={scene.text}
              visualSuggestion={scene.visualSuggestion}
              icon={<Film className="mr-2 h-5 w-5 text-blue-500" />}
            />
          ))}
          <SceneCard title="Call to Action 📣" text={script.cta} icon={<MessageSquareHeart className="mr-2 h-5 w-5 text-red-500" />} />
          
          {!showAdjustmentInput && (
            <div className="pt-4 flex justify-center">
              <Button 
                onClick={() => setShowAdjustmentInput(true)} 
                variant="outline" 
                className="shadow-md bg-primary/10 hover:bg-primary/20 border-primary/50 text-primary" 
                disabled={isLoading}
              >
                <PencilLine className="mr-2 h-4 w-4" /> Request Adjustments
              </Button>
            </div>
          )}
        </div>
      )}

      {script && showAdjustmentInput && (
        <Card className={`shadow-lg border-primary/50 bg-card/90 backdrop-blur-md mt-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <PencilLine className="mr-2 h-5 w-5" />
              Adjust Your Script
            </CardTitle>
            <CardDescription>Describe the changes you'd like to make to the script above.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'Make the hook funnier', 'Change scene 2 to be about dogs instead of cats', 'Add a specific hashtag to the CTA'"
              value={adjustmentRequest}
              onChange={(e) => setAdjustmentRequest(e.target.value)}
              rows={4}
              className="bg-background/70 focus:bg-background"
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => { setShowAdjustmentInput(false); setAdjustmentRequest(""); }} disabled={isLoading}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSubmitAdjustment} disabled={isLoading || !adjustmentRequest.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <PencilLine className="mr-2 h-4 w-4" />}
                Submit Adjustments
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OutputSection;

