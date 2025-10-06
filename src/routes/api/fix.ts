import { createFileRoute } from '@tanstack/react-router';
import { streamObject } from 'ai';
import z from 'zod';
import { openai } from '@/ai/providers';
import { dedent } from '@/lib/utils';
import { fixedTextSchema } from '@/schemas/fixed-text-schema';

const textSchema = z.object({
  text: z.string().max(1000),
});

export const Route = createFileRoute('/api/fix')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = await request.json();
        const parsed = textSchema.safeParse(json);

        if (!parsed.success) {
          return new Response(
            JSON.stringify({
              error: 'Bad Request',
              success: false,
              message: parsed.error.message,
              statusCode: 400,
            }),
            { status: 400 },
          );
        }

        const { text } = parsed.data;

        const stream = streamObject({
          model: openai('gpt-5'),
          schema: fixedTextSchema,
          prompt: dedent(`
              You are a professional editor specializing in grammar and spelling correction.
              Your task: Fix all spelling, grammar, punctuation, and clarity issues in the following text while preserving the original meaning and tone.

              Rules:
              - Correct all spelling mistakes
              - Fix grammatical errors (subject-verb agreement, tense consistency, etc.)
              - Improve punctuation and sentence structure
              - Enhance clarity and readability
              - Maintain the original voice and intent
              - Keep the same level of formality

              Text to correct:
              """
              ${text}
              """

              Provide the corrected text and a brief explanation of the main changes made.`),
        });

        return stream.toTextStreamResponse();
      },
    },
  },
});
