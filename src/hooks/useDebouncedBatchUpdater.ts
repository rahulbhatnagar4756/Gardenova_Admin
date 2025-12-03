import { useRef, useState } from "react";

/**
 * A function that performs an asynchronous update for a specific ID with a given value.
 *
 * @template TValue
 * @param {string} id Identifier for the item being updated.
 * @param {TValue} value The value to update.
 * @returns {Promise<unknown>} A promise that resolves when the update is complete.
 */
type UpdateFn<TValue> = (id: string, value: TValue) => Promise<unknown>;

/**
 * Creates a debounced batch updater. It collects multiple updates over a delay
 * and sends them together in a single async batch operation.
 *
 * @template TValue
 * @param {UpdateFn<TValue>} updateFn The async update function executed for each ID–value pair.
 * @param {number} [delay=1000] The debounce delay in milliseconds before sending updates.
 * @param {() => void} [onSuccess] Optional callback fired when all updates complete successfully.
 * @param {(failedCount: number) => void} [onError] Optional callback fired if one or more updates fail.
 *
 * @returns {{
 *   triggerUpdate: (id: string, value: TValue) => void
 * }} An object containing the triggerUpdate function.
 */
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

  /**
   * Adds an update to the queue and debounces the execution.
   *
   * @param {string} id The ID of the item being updated.
   * @param {TValue} value The new value for the item.
   * @returns {void}
   */
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
