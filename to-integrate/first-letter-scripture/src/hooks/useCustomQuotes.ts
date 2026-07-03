import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomQuote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  scripture_reference?: string;
  created_at: string;
  updated_at: string;
}

export const useCustomQuotes = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["customQuotes", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_custom_quotes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CustomQuote[];
    },
    enabled: !!userId,
  });

  const addQuoteMutation = useMutation({
    mutationFn: async ({
      title,
      content,
      scripture_reference,
    }: {
      title: string;
      content: string;
      scripture_reference?: string;
    }) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_custom_quotes")
        .insert({
          user_id: userId,
          title,
          content,
          scripture_reference,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newQuote) => {
      await queryClient.cancelQueries({ queryKey: ["customQuotes", userId] });
      const previousQuotes = queryClient.getQueryData<CustomQuote[]>([
        "customQuotes",
        userId,
      ]);

      const optimisticQuote: CustomQuote = {
        id: `temp-${Date.now()}`,
        user_id: userId!,
        title: newQuote.title,
        content: newQuote.content,
        scripture_reference: newQuote.scripture_reference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<CustomQuote[]>(
        ["customQuotes", userId],
        (old = []) => [optimisticQuote, ...old]
      );

      return { previousQuotes };
    },
    onSuccess: () => {
      toast.success("Custom quote added successfully");
    },
    onError: (error, _variables, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(
          ["customQuotes", userId],
          context.previousQuotes
        );
      }
      toast.error("Failed to add custom quote");
      console.error("Error adding custom quote:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["customQuotes", userId] });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { error } = await supabase
        .from("user_custom_quotes")
        .delete()
        .eq("id", quoteId)
        .eq("user_id", userId!);

      if (error) throw error;
    },
    onMutate: async (quoteId) => {
      await queryClient.cancelQueries({ queryKey: ["customQuotes", userId] });
      const previousQuotes = queryClient.getQueryData<CustomQuote[]>([
        "customQuotes",
        userId,
      ]);

      queryClient.setQueryData<CustomQuote[]>(
        ["customQuotes", userId],
        (old = []) => old.filter((q) => q.id !== quoteId)
      );

      return { previousQuotes };
    },
    onSuccess: () => {
      toast.success("Custom quote removed");
    },
    onError: (error, _variables, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(
          ["customQuotes", userId],
          context.previousQuotes
        );
      }
      toast.error("Failed to remove custom quote");
      console.error("Error removing custom quote:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["customQuotes", userId] });
    },
  });

  return {
    quotes,
    isLoading,
    addQuote: (title: string, content: string, scripture_reference?: string) =>
      addQuoteMutation.mutate({ title, content, scripture_reference }),
    deleteQuote: deleteQuoteMutation.mutate,
  };
};
