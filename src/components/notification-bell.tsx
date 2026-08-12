import { Bell } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReviews, useTasks, today } from "@/hooks/use-hifz";
import { scheduleDailyReviewReminder } from "@/lib/local-reminders";

export function NotificationBell() {
  const { data: reviews = [] } = useReviews();
  const { data: tasks = [] } = useTasks();

  const dueReviews = reviews.filter((r) => !r.done && r.due_date <= today());
  const openTasks = tasks.filter((t) => !t.done);
  const count = dueReviews.length + openTasks.length;

  useEffect(() => {
    void scheduleDailyReviewReminder(count);
  }, [count]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-5" />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="mb-3 font-display text-sm font-semibold">Rappels</p>
        {count === 0 ? (
          <p className="text-sm text-muted-foreground">Tout est à jour, qu'Allah te facilite 🌿</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {dueReviews.slice(0, 5).map((review) => (
              <li key={review.id} className="rounded-lg bg-muted px-3 py-2">
                <span className="font-medium">Révision du jour</span> · {review.label}
              </li>
            ))}
            {openTasks.slice(0, 5).map((task) => (
              <li key={task.id} className="rounded-lg bg-muted px-3 py-2">
                <span className="font-medium">Tâche non terminée</span> · {task.label}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
