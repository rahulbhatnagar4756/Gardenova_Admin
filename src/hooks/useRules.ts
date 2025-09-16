import { useState, useEffect, useCallback } from "react";
import { ruleService } from "../services/apiCalls/rules";
import type {
  Rule,
  CreateRuleRequest,
  UpdateRuleRequest,
} from "../services/apiCalls/rules";

interface UseRulesReturn {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  createRule: (data: CreateRuleRequest) => Promise<void>;
  updateRule: (id: string, data: UpdateRuleRequest) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  refreshRules: () => Promise<void>;
}

export const useRules = (): UseRulesReturn => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ruleService.getAllRules();

      if (response.success && response.data) {
        // Handle both array and object with rules array
        const rulesData = Array.isArray(response.data)
          ? response.data
          : response.data.rules || [];
        setRules(rulesData);
      } else {
        setError(response.message || "Failed to fetch rules");
      }
    } catch (err) {
      console.error("Error fetching rules:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = useCallback(
    async (data: CreateRuleRequest): Promise<void> => {
      try {
        setError(null);
        const response = await ruleService.createRule(data);

        if (response.success) {
          // Refresh the rules list after successful creation
          await fetchRules();
        } else {
          setError(response.message || "Failed to create rule");
        }
      } catch (err) {
        console.error("Error creating rule:", err);
        setError(err instanceof Error ? err.message : "Failed to create rule");
        throw err; // Re-throw to allow component to handle
      }
    },
    [fetchRules]
  );

  const updateRule = useCallback(
    async (id: string, data: UpdateRuleRequest): Promise<void> => {
      try {
        setError(null);
        const response = await ruleService.updateRule(id, data);

        if (response.success) {
          // Refresh the rules list after successful update
          await fetchRules();
        } else {
          setError(response.message || "Failed to update rule");
        }
      } catch (err) {
        console.error("Error updating rule:", err);
        setError(err instanceof Error ? err.message : "Failed to update rule");
        throw err; // Re-throw to allow component to handle
      }
    },
    [fetchRules]
  );

  const deleteRule = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        const response = await ruleService.deleteRule(id);

        if (response.success) {
          // Refresh the rules list after successful deletion
          await fetchRules();
        } else {
          setError(response.message || "Failed to delete rule");
        }
      } catch (err) {
        console.error("Error deleting rule:", err);
        setError(err instanceof Error ? err.message : "Failed to delete rule");
        throw err; // Re-throw to allow component to handle
      }
    },
    [fetchRules]
  );

  const refreshRules = useCallback(async (): Promise<void> => {
    await fetchRules();
  }, [fetchRules]);

  // Initial fetch on mount
  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    loading,
    error,
    createRule,
    updateRule,
    deleteRule,
    refreshRules,
  };
};
