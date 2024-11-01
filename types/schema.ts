import { z } from "zod";

export const GroupSchema = z.object({
  id: z.string().optional(),
  group_id: z.string().min(1),
  users: z.array(z.string()), // array of user IDs
});

export type Group = z.infer<typeof GroupSchema>;

export const ConversationSchema = z.object({
  id: z.string().optional(),
  group_id: z.string().min(1),
  message_id: z.string().min(1),
  sender: z.string().min(1),
});

export type Conversation = z.infer<typeof ConversationSchema>;
