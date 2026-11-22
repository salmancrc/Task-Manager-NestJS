export const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ReminderType = 'DUE_SOON' | 'OVERDUE';

export interface ReminderTask {
  completed: boolean;
  deletedAt: Date | null;
  dueDate: Date | null;
}

export function getReminderType(
  task: ReminderTask,
  now: Date = new Date(),
): ReminderType | null {
  if (task.completed || task.deletedAt || !task.dueDate) {
    return null;
  }

  const dueTime = task.dueDate.getTime();
  const nowTime = now.getTime();

  if (dueTime < nowTime) {
    return 'OVERDUE';
  }

  if (dueTime - nowTime <= REMINDER_WINDOW_MS) {
    return 'DUE_SOON';
  }

  return null;
}
