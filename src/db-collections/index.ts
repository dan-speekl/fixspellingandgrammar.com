import {
  createCollection,
  localOnlyCollectionOptions,
} from '@tanstack/react-db';
import { z } from 'zod';

const messageSchema = z.object({
  id: z.number(),
  originalText: z.string(),
  correctedText: z.string(),
  explanation: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export const messagesCollection = createCollection(
  localOnlyCollectionOptions({
    getKey: (message) => message.id,
    schema: messageSchema,
  }),
);
