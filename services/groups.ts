import { supabase } from "../types/supabase";
import { GroupSchema, type Group } from "../types/schema";

type SupabaseResponse<T> = {
  data: T | null;
  error: unknown;
};

export const groupsService = {
  async create(group: Omit<Group, "id" | "created" | "updated">) {
    const validatedGroup = GroupSchema.omit({
      id: true,
      created: true,
      updated: true,
    }).parse(group);

    const { data, error } = (await supabase
      .from("groups")
      .insert([validatedGroup])
      .select()
      .single()) as SupabaseResponse<Group>;

    if (error) throw new Error(String(error));
    return data as Group;
  },

  async delete(id: string) {
    const { data, error } = (await supabase
      .from("groups")
      .delete()
      .eq("id", id)) as SupabaseResponse<Group>;

    if (error) throw new Error(String(error));
    return data as Group;
  },

  async update(id: string, group: Partial<Group>) {
    const validatedGroup = GroupSchema.partial().parse(group);

    const { data, error } = (await supabase
      .from("groups")
      .update({ ...validatedGroup, updated: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()) as SupabaseResponse<Group>;

    if (error) throw new Error(String(error));
    return data as Group;
  },

  async getById(id: string) {
    const { data, error } = (await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single()) as SupabaseResponse<Group>;

    if (error) throw new Error(String(error));
    return data as Group;
  },

  async getByUserId(userId: string) {
    const { data, error } = (await supabase
      .from("groups")
      .select("*")
      .contains("users", [userId])) as SupabaseResponse<Group[]>;

    if (error) throw new Error(String(error));
    return data as Group[];
  },

  async addMember(groupId: string, userId: string) {
    const group = await this.getById(groupId);
    if (!group) throw new Error("Group not found");
    const updatedMembers = [...new Set([...group.users, userId])];

    return this.update(groupId, { users: updatedMembers });
  },

  async removeMember(groupId: string, userId: string) {
    const group = await this.getById(groupId);
    if (!group) throw new Error("Group not found");
    const updatedMembers = group.users.filter((id: string) => id !== userId);

    return this.update(groupId, { users: updatedMembers });
  },
};
