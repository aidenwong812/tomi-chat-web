import { supabase } from "../types/supabase";
import type { Conversation } from "../types/schema";
import { ConversationSchema } from "../types/schema";

export const conversationsService = {
  async saveConversation(
    conversation: Omit<Conversation, "id" | "created" | "updated">,
  ) {
    const validatedConversation = ConversationSchema.omit({
      id: true,
    }).parse(conversation);

    const { data, error } = (await supabase
      .from("conversations")
      .insert([validatedConversation])
      .select()
      .single()) as { data: Conversation | null; error: unknown };

    if (error) throw new Error(String(error));
    return data as Conversation;
  },

  async getConversation(group_id: string) {
    const { data, error } = (await supabase
      .from("conversations")
      .select()
      .eq("group_id", group_id)) as { data: Conversation[]; error: unknown };

    if (error) throw new Error(String(error));
    return data;
  },

  async deleteConversation(group_id: string) {
    const { error } = (await supabase
      .from("conversations")
      .delete()
      .eq("group_id", group_id)) as { error: unknown };

    if (error) throw new Error(String(error));
  },
};
