"use client";

import { useEffect } from "react";
import { getUpcomingEvents } from "@/actions/notifications";

export function NotificationManager() {
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const notifiedIds = new Set<string>();

    const checkEvents = async () => {
      if (Notification.permission !== "granted") return;

      const events = await getUpcomingEvents();
      const now = new Date();

      events.forEach((event) => {
        if (!event.start_time || notifiedIds.has(event.id)) return;

        const [hours, minutes] = event.start_time.split(":").map(Number);
        const eventDate = new Date();
        eventDate.setHours(hours, minutes, 0, 0);

        const diffMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);

        // Notify if event is in the next 10 minutes
        if (diffMinutes > 0 && diffMinutes <= 10) {
          new Notification("Sự kiện sắp diễn ra", {
            body: `${event.title} sẽ bắt đầu lúc ${event.start_time}`,
            icon: "/favicon.ico",
          });
          notifiedIds.add(event.id);
        }
      });
    };

    const interval = setInterval(checkEvents, 60000); // Check every minute
    checkEvents();

    return () => clearInterval(interval);
  }, []);

  return null;
}
