"use client";

import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

type WorkspaceRealtimeSyncProps = {
  userId: string;
  tables: string[];
  enabled?: boolean;
};

export function WorkspaceRealtimeSync({
  userId,
  tables,
  enabled = true,
}: WorkspaceRealtimeSyncProps) {
  useRealtimeRefresh({ userId, tables, enabled });
  return null;
}
