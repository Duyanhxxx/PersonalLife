export type PlannerEvent = {
  id: string;
  title: string;
  entry_date: string;
  start_time: string | null;
  end_time: string | null;
  tone: string;
  notes: string | null;
};

export type FinanceEntry = {
  id: string;
  entry_date: string;
  title: string;
  amount: number;
  entry_type: "income" | "expense";
  category: string;
};

export type TodoItem = {
  id: string;
  entry_date: string;
  title: string;
  priority: "urgent" | "important" | "normal" | "low";
  color: string;
  is_done: boolean;
};

export type Mission = {
  id: string;
  title: string;
  color: string;
  target_value: number;
  current_value: number;
};

export type MissionEntry = {
  id: string;
  mission_id: string;
  entry_date: string;
  progress_delta: number;
  note: string | null;
};

export type ReadingBook = {
  id: string;
  title: string;
  author: string | null;
  cover_path: string | null;
  cover_url: string | null;
  status: "to_read" | "reading" | "finished";
};
