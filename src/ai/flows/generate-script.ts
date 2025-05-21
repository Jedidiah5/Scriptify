'use server';

/**
 * @fileOverview Generates a short-form video script based on a topic, format, and style.
 *
 * - generateScript - A function that generates the video script.
 * - GenerateScriptInput - The input type for the generateScript function.
 * - GenerateScriptOutput - The return type for the generateScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateScriptInputSchema, GenerateScriptOutputSchema } from '@/ai/schemas/script-schemas';

export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
  return generateScriptFlow(input);
}

const generateScriptPrompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {schema: GenerateScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema},
  prompt: `You are a creative video script writer specializing in short-form content.

You will generate a script for a video based on the following information:

Topic: {{{topic}}}
Format: {{{format}}}
Style: {{{style}}}

The script should include:

*   A catchy hook to grab the viewer’s attention.
*   3-4 scenes with text and visual suggestions.
*   A closing call to action.

Ensure the script is appropriate for the specified format and style.

Output the script in a structured format, with the hook, scenes, and CTA clearly labeled.

Make the video script engaging and creative, designed to capture the audience's attention from the first second. Use humor, storytelling, or intriguing facts to create a memorable viewing experience. Each scene should include a concise and impactful text along with creative visual suggestions that complement the narrative. The call to action should be persuasive, encouraging viewers to like, follow, share, or engage further with the content. Tailor the script's tone, length, and pace to fit the specified format and style, ensuring it resonates with the target audience and is optimized for maximum impact and shareability.

Remember to incorporate current trends and challenges to enhance the content's relevance and appeal.

Example Script:

{
  "hook": "Did you know that you can save hundreds of dollars a year just by making a few simple changes to your daily routine?",
  "scenes": [
    {
      "text": "Scene 1: Cut back on eating out. Bring your lunch to work or school instead of buying it.",
      "visualSuggestion": "Show a split screen of someone buying an expensive lunch vs. someone preparing a healthy meal at home.",
    },
    {
      "text": "Scene 2: Cancel unused subscriptions. Many people are paying for services they no longer use or need.",
      "visualSuggestion": "Display a montage of various subscription services, like streaming platforms, gym memberships, and software.",
    },
    {
      "text": "Scene 3: Look for discounts and deals. Use coupons, promo codes, and cashback apps to save money on purchases.",
      "visualSuggestion": "Show someone happily using a coupon at a grocery store or finding a great deal online.",
    },
  ],
  "cta": "Follow us for more money-saving tips! #savemoney #moneysavingtips #finance",
}

`, 
});

const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await generateScriptPrompt(input);
    return output!;
  }
);
