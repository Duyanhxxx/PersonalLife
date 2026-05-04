"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UseRealtimeRefreshOptions = {
  userId: string;
  tables: string[];
  enabled?: boolean;
  debounceMs?: number;
};

export function useRealtimeRefresh({
  userId,
  tables,
  enabled = true,
  debounceMs = 700,
}: UseRealtimeRefreshOptions) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled || !userId || tables.length === 0) return;

    const supabase = createClient();
    const channel = supabase.channel(`workspace-sync:${userId}:${tables.join(",")}`);
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        router.refresh();
      }, debounceMs);
    };

    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `user_id=eq.${userId}`,
        },
        scheduleRefresh,
      );
    });

    channel.subscribe();

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      void supabase.removeChannel(channel);
    };
  }, [debounceMs, enabled, router, tables, userId]);
}
