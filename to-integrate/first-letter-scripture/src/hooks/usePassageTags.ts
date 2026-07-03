import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PassageTag {
  id: string;
  passage_id: string;
  tag: string;
}

export function usePassageTags(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: allTags = [], isLoading } = useQuery({
    queryKey: ['passage-tags', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('passage_tags')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data as PassageTag[];
    },
    enabled: !!userId,
  });

  // Unique tags across all passages
  const uniqueTags = useMemo(
    () => [...new Set(allTags.map(t => t.tag))].sort(),
    [allTags]
  );

  // Stable map of passage ID -> tag strings (avoids re-creating on every render)
  const tagsByPassageMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const t of allTags) {
      if (!map[t.passage_id]) map[t.passage_id] = [];
      map[t.passage_id].push(t.tag);
    }
    return map;
  }, [allTags]);

  // Tag counts for the filter bar
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of allTags) {
      counts[t.tag] = (counts[t.tag] || 0) + 1;
    }
    return counts;
  }, [allTags]);

  const addTag = useMutation({
    mutationFn: async ({ passageId, tag }: { passageId: string; tag: string }) => {
      if (!userId) throw new Error('Not authenticated');
      const trimmed = tag.trim();
      const { error } = await supabase
        .from('passage_tags')
        .insert({ user_id: userId, passage_id: passageId, tag: trimmed });
      if (error) {
        if (error.code === '23505') return; // duplicate, ignore
        throw error;
      }
    },
    onMutate: async ({ passageId, tag }) => {
      const trimmed = tag.trim();
      await queryClient.cancelQueries({ queryKey: ['passage-tags', userId] });
      const previous = queryClient.getQueryData<PassageTag[]>(['passage-tags', userId]);
      if (previous) {
        const alreadyExists = previous.some(t => t.passage_id === passageId && t.tag === trimmed);
        if (!alreadyExists) {
          queryClient.setQueryData<PassageTag[]>(['passage-tags', userId], [
            ...previous,
            { id: 'optimistic-' + Date.now(), passage_id: passageId, tag: trimmed },
          ]);
        }
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['passage-tags', userId], context.previous);
      }
      toast.error('Failed to add tag');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['passage-tags', userId] });
    },
  });

  const removeTag = useMutation({
    mutationFn: async ({ passageId, tag }: { passageId: string; tag: string }) => {
      if (!userId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('passage_tags')
        .delete()
        .eq('user_id', userId)
        .eq('passage_id', passageId)
        .eq('tag', tag);
      if (error) throw error;
    },
    onMutate: async ({ passageId, tag }) => {
      await queryClient.cancelQueries({ queryKey: ['passage-tags', userId] });
      const previous = queryClient.getQueryData<PassageTag[]>(['passage-tags', userId]);
      if (previous) {
        queryClient.setQueryData<PassageTag[]>(
          ['passage-tags', userId],
          previous.filter(t => !(t.passage_id === passageId && t.tag === tag))
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['passage-tags', userId], context.previous);
      }
      toast.error('Failed to remove tag');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['passage-tags', userId] });
    },
  });

  return {
    allTags,
    uniqueTags,
    tagsByPassageMap,
    tagCounts,
    addTag: addTag.mutate,
    removeTag: removeTag.mutate,
    isLoading,
  };
}
