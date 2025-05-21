'use server';
/**
 * @fileOverview Adjusts an existing video script based on user feedback.
 *
 * - adjustScript - A function that handles the script adjustment process.
 * - AdjustScriptInput - The input type for the adjustScript function.
 * - AdjustScriptOutput - The return type for the adjustScript function (same as GenerateScriptOutput).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AdjustScriptInputSchema, GenerateScriptOutputSchema } from '@/ai/schemas/script-schemas';

export type AdjustScriptInput = z.infer<typeof AdjustScriptInputSchema>;
export type AdjustScriptOutput = z.infer<typeof GenerateScriptOutputSchema>; 

export async function adjustScript(input: AdjustScriptInput): Promise<AdjustScriptOutput> {
  return adjustScriptFlow(input);
}

const adjustScriptPrompt = ai.definePrompt({
  name: 'adjustScriptPrompt',
  input: {schema: AdjustScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema}, 
  prompt: `You are an expert video script editor. You will be given an existing video script and a user's request for adjustments.
Your task is to intelligently modify the script according to the user's request, while maintaining the script's structure (hook, scenes, cta) and quality.

Original Script:
Hook: {{{originalScript.hook}}}
Scenes:
{{#each originalScript.scenes}}
- Scene Text: "{{this.text}}"
  Visual Suggestion: "{{this.visualSuggestion}}"
{{/each}}
Call to Action: {{{originalScript.cta}}}

User's Adjustment Request:
"{{{adjustmentRequest}}}"

Based on the user's request, provide the fully adjusted script. Ensure the output is a valid JSON object adhering to the specified output schema.
If the request is vague, use your best judgment to make compelling changes.
If the request is impossible or completely changes the core topic in a way that makes the original script irrelevant, try to adapt or politely state that the specific adjustment cannot be fully made while still being an "adjustment" of the original.
Output the complete, adjusted script in the required JSON format.
`,
});

const adjustScriptFlow = ai.defineFlow(
  {
    name: 'adjustScriptFlow',
    inputSchema: AdjustScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async (input) => {
    const {output} = await adjustScriptPrompt(input);
    if (!output) {
      throw new Error("The AI failed to return an adjusted script.");
    }
    return output;
  }
);
