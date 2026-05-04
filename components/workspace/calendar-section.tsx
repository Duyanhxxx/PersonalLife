import { CalendarPlanner } from "@/components/workspace/calendar-planner";
import { getPlannerEvents } from "@/lib/workspace/planner";
import type { AwaitedReturn } from "@/types/utils";

type CalendarSectionProps = {
  data: AwaitedReturn<typeof getPlannerEvents>;
};

export async function CalendarSection({ data }: CalendarSectionProps) {
  return <CalendarPlanner {...data} />;
}
