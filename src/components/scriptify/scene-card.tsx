"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Video } from "lucide-react";

interface SceneCardProps {
  title: string;
  text: string;
  visualSuggestion?: string;
  icon?: React.ReactNode;
}

const SceneCard: FC<SceneCardProps> = ({ title, text, visualSuggestion, icon }) => {
  return (
    <Card className="shadow-lg_ border_ border-border/70_ bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-semibold text-primary">
          {icon || <Video className="mr-2 h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-foreground/90">{text}</p>
        {visualSuggestion && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="flex items-center text-xs text-muted-foreground italic">
              <Lightbulb className="mr-2 h-3.5 w-3.5 text-accent" />
              {visualSuggestion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SceneCard;
