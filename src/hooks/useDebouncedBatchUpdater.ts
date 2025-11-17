import { useRef, useState } from "react";

type UpdateFn<TValue> = (id: string, value: TValue) => Promise<unknown>;

export function useDebouncedBatchUpdater<TValue>(
  updateFn: UpdateFn<TValue>,
  delay = 1000,
  onSuccess?: () => void,
  onError?: (failedCount: number) => void
) {
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, TValue>>(
    {}
  );

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerUpdate = (id: string, value: TValue) => {
    setPendingUpdates((prev) => {
      const updated = { ...prev, [id]: value };

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        const updatesToSend = { ...updated };
        const entries = Object.entries(updatesToSend);

        if (entries.length === 0) {
          setPendingUpdates({});
          return;
        }

        try {
          const results = await Promise.all(
            entries.map(async ([itemId, val]) => {
              try {
                await updateFn(itemId, val);
                return { id: itemId, success: true };
              } catch (err) {
                console.error("Update failed:", itemId, err);
                return { id: itemId, success: false };
              }
            })
          );

          const failed = results.filter((r) => !r.success).length;

          if (failed === 0) {
            if (onSuccess) onSuccess(); // FIX: no-unused-expressions
          } else {
            if (onError) onError(failed); // FIX: no-unused-expressions
          }
        } catch (error) {
          console.error("Batch update error:", error);
          if (onError) onError(entries.length);
        } finally {
          setPendingUpdates({});
          debounceTimerRef.current = null;
        }
      }, delay);

      return updated;
    });
  };

  return {
    triggerUpdate,
    pendingUpdates,
  };
}
