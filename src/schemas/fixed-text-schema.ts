import z from 'zod';

export const fixedTextSchema = z.object({
  fixedText: z
    .string()
    .describe(
      'The corrected version of the text with all spelling, grammar, punctuation, and clarity issues fixed',
    ),
  explanation: z
    .string()
    .describe(
      'A brief, clear explanation of the main changes made during correction',
    ),
});
