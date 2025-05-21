/**
 * @fileOverview Zod schemas for video script generation and adjustment.
 * This file does not use 'use server' and can be imported by server-side files.
 */
import {z} from 'genkit';

export const SceneSchema = z.object({
  text: z.string().describe('The text for the scene.'),
  visualSuggestion: z.string().describe('A suggestion for the visuals in the scene.'),
});

export const GenerateScriptOutputSchema = z.object({
  hook: z.string().describe('A catchy hook to grab the viewer’s attention.'),
  scenes: z.array(SceneSchema).describe('An array of scenes with text and visual suggestions.'),
  cta: z.string().describe('A closing call to action.'),
});

export const GenerateScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the video.'),
  format: z.enum(['TikTok', 'Instagram Reel', 'YouTube Short']).describe('The video format.'),
  style: z.enum(['Listicle', 'Skit', 'Storytime', 'How-To']).describe('The video style.'),
});

export const AdjustScriptInputSchema = z.object({
  originalScript: GenerateScriptOutputSchema.describe("The original video script content."),
  adjustmentRequest: z.string().describe('The user\'s requested adjustments for the script.'),
});
