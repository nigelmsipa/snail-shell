import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Passage, PassageStatus } from '@/types/passage';
import { toast } from 'sonner';

interface CreatePassageInput {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  versionId: string;
}

export function usePassages(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: passages = [], isLoading } = useQuery({
    queryKey: ['passages', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_passages')
        .select('*, bible_versions!inner(abbreviation)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((p): Passage => ({
        id: p.id,
        userId: p.user_id,
        book: p.book,
        chapter: p.chapter,
        verseStart: p.verse_start,
        verseEnd: p.verse_end,
        currentVerse: p.current_verse ?? 1,
        status: p.status as PassageStatus,
        versionId: p.version_id,
        versionAbbreviation: (p.bible_versions as { abbreviation: string })?.abbreviation,
        createdAt: p.created_at ?? '',
        updatedAt: p.updated_at ?? '',
        displayOrder: p.display_order ?? undefined,
        note: p.note ?? null,
      }));
    },
    enabled: !!userId,
  });

  const createPassage = useMutation({
    mutationFn: async (input: CreatePassageInput) => {
      if (!userId) throw new Error('Not authenticated');
      
      // Compute next display_order
      const maxOrder = passages.reduce((max, p) => Math.max(max, p.displayOrder ?? 0), 0);
      
      const { data, error } = await supabase
        .from('user_passages')
        .insert({
          user_id: userId,
          book: input.book,
          chapter: input.chapter,
          verse_start: input.verseStart,
          verse_end: input.verseEnd,
          current_verse: input.verseStart,
          status: 'in_progress',
          version_id: input.versionId,
          display_order: maxOrder + 1,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages', userId] });
      toast.success('Passage added');
    },
    onError: (error) => {
      toast.error('Failed to add passage');
      console.error(error);
    },
  });

  const updatePassage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Passage> }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.currentVerse !== undefined) updateData.current_verse = updates.currentVerse;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.note !== undefined) updateData.note = updates.note;

      const { error } = await supabase
        .from('user_passages')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages', userId] });
    },
  });

  const deletePassage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_passages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages', userId] });
      toast.success('Passage removed');
    },
    onError: () => {
      toast.error('Failed to remove passage');
    },
  });

  const updateDisplayOrder = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      // Batch update display_order for each passage
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('user_passages')
          .update({ display_order: index + 1 })
          .eq('id', id)
      );
      const results = await Promise.all(updates);
      const firstError = results.find(r => r.error);
      if (firstError?.error) throw firstError.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages', userId] });
    },
    onError: () => {
      toast.error('Failed to update order');
    },
  });

  return {
    passages,
    isLoading,
    createPassage: createPassage.mutate,
    updatePassage: updatePassage.mutate,
    deletePassage: deletePassage.mutate,
    updateDisplayOrder: updateDisplayOrder.mutate,
    isCreating: createPassage.isPending,
  };
}
