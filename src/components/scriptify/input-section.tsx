"use client";

import type { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2, Film, ListOrdered, Drama, BookOpenText, Settings2, Sparkles } from "lucide-react";
import type { VideoFormat, VideoStyle } from '@/lib/constants';
import { VIDEO_FORMATS, VIDEO_STYLES } from '@/lib/constants';

interface InputSectionProps {
  topic: string;
  setTopic: (topic: string) => void;
  format: VideoFormat;
  setFormat: (format: VideoFormat) => void;
  style: VideoStyle;
  setStyle: (style: VideoStyle) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const formatIcons: Record<VideoFormat, React.ReactNode> = {
  "TikTok": <Film className="h-4 w-4 mr-2" />,
  "Instagram Reel": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  "YouTube Short": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>,
};

const styleIcons: Record<VideoStyle, React.ReactNode> = {
  "Listicle": <ListOrdered className="h-4 w-4 mr-2" />,
  "Skit": <Drama className="h-4 w-4 mr-2" />,
  "Storytime": <BookOpenText className="h-4 w-4 mr-2" />,
  "How-To": <Settings2 className="h-4 w-4 mr-2" />,
};

const InputSection: FC<InputSectionProps> = ({
  topic,
  setTopic,
  format,
  setFormat,
  style,
  setStyle,
  onGenerate,
  isLoading,
}) => {
  return (
    <Card className="shadow-xl border-border/80 bg-card/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-primary">
          <Sparkles className="mr-2 h-6 w-6" />
          Create Your Script
        </CardTitle>
        <CardDescription>Tell us about your video idea, and we'll craft a script for you!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-sm font-medium text-foreground/90">Video Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., 'How to save money as a student'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-background/70 focus:bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground/90">Video Format</Label>
          <RadioGroup
            value={format}
            onValueChange={(value) => setFormat(value as VideoFormat)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {VIDEO_FORMATS.map((fmt) => (
              <Label
                key={fmt}
                htmlFor={`format-${fmt}`}
                className={`flex items-center justify-center p-3 rounded-md border-2 cursor-pointer transition-all text-sm
                  ${format === fmt ? 'border-primary bg-primary/10 text-primary' : 'border-input hover:border-accent bg-background/70 hover:bg-accent/10'}
                `}
              >
                <RadioGroupItem value={fmt} id={`format-${fmt}`} className="sr-only" />
                {formatIcons[fmt]}
                {fmt}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground/90">Video Style</Label>
          <RadioGroup
            value={style}
            onValueChange={(value) => setStyle(value as VideoStyle)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            {VIDEO_STYLES.map((stl) => (
              <Label
                key={stl}
                htmlFor={`style-${stl}`}
                className={`flex items-center justify-center p-3 rounded-md border-2 cursor-pointer transition-all text-sm
                  ${style === stl ? 'border-primary bg-primary/10 text-primary' : 'border-input hover:border-accent bg-background/70 hover:bg-accent/10'}
                `}
              >
                <RadioGroupItem value={stl} id={`style-${stl}`} className="sr-only" />
                 {styleIcons[stl]}
                {stl}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full text-base py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Generate Script
        </Button>
      </CardContent>
    </Card>
  );
};

export default InputSection;
