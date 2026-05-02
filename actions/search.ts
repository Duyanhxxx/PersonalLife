"use server";

import { globalSearch } from "@/lib/workspace/search";
import { requireUser } from "@/lib/auth/session";

export async function searchAction(query: string) {
  const user = await requireUser();
  return globalSearch(user.id, query);
}
