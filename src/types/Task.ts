export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  attachments: string[];
}
