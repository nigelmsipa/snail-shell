import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SavedVerse {
  id: string;
  pericope_id?: string;
  book?: string;
  chapter?: number;
  start_verse?: number;
  end_verse?: number;
  custom_name?: string;
  created_at: string;
  // Joined pericope data
  pericope?: {
    id: string;
    name: string;
    chapter: number;
    verse_start: number;
    verse_end: number;
    book_name: string;
  };
}

export function useSavedVerses(userId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch saved verses with React Query
  const { data: savedVerses = [], isLoading } = useQuery({
    queryKey: ['savedVerses', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_saved_verses')
        .select(`
          id,
          pericope_id,
          book,
          chapter,
          start_verse,
          end_verse,
          custom_name,
          created_at,
          bible_pericopes (
            id,
            name,
            chapter,
            verse_start,
            verse_end,
            bible_books(name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved verses:', error);
        throw error;
      }

      const formatted = data?.map((item: any) => ({
        id: item.id,
        pericope_id: item.pericope_id,
        book: item.book,
        chapter: item.chapter,
        start_verse: item.start_verse,
        end_verse: item.end_verse,
        custom_name: item.custom_name,
        created_at: item.created_at,
        pericope: item.bible_pericopes ? {
          id: item.bible_pericopes.id,
          name: item.bible_pericopes.name,
          chapter: item.bible_pericopes.chapter,
          verse_start: item.bible_pericopes.verse_start,
          verse_end: item.bible_pericopes.verse_end,
          book_name: item.bible_pericopes.bible_books?.name || ''
        } : undefined
      })) || [];

      return formatted;
    },
    enabled: !!userId
  });

  // Add custom verse mutation with optimistic update
  const addCustomVerseMutation = useMutation({
    mutationFn: async (params: {
      book: string;
      chapter: number;
      startVerse: number;
      endVerse: number | null;
      customName: string | null;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { error, data } = await supabase
        .from('user_saved_verses')
        .insert({
          user_id: userId,
          book: params.book,
          chapter: params.chapter,
          start_verse: params.startVerse,
          end_verse: params.endVerse,
          custom_name: params.customName
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newVerse) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['savedVerses', userId] });

      // Snapshot previous value
      const previousVerses = queryClient.getQueryData<SavedVerse[]>(['savedVerses', userId]);

      // Optimistically update - add temporary verse
      if (previousVerses) {
        const optimisticVerse: SavedVerse = {
          id: 'temp-' + Date.now(),
          book: newVerse.book,
          chapter: newVerse.chapter,
          start_verse: newVerse.startVerse,
          end_verse: newVerse.endVerse,
          custom_name: newVerse.customName,
          created_at: new Date().toISOString()
        };
        queryClient.setQueryData<SavedVerse[]>(
          ['savedVerses', userId],
          [optimisticVerse, ...previousVerses]
        );
      }

      return { previousVerses };
    },
    onSuccess: () => {
      toast({ title: 'Verse added!' });
    },
    onError: (error: any, _, context) => {
      // Rollback on error
      if (context?.previousVerses) {
        queryClient.setQueryData(['savedVerses', userId], context.previousVerses);
      }
      toast({ title: 'Could not add verse', description: error.message, variant: 'destructive' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savedVerses', userId] });
    }
  });

  // Remove verse mutation with optimistic update
  const removeSavedVerseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_saved_verses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['savedVerses', userId] });

      // Snapshot previous value
      const previousVerses = queryClient.getQueryData<SavedVerse[]>(['savedVerses', userId]);

      // Optimistically update
      if (previousVerses) {
        queryClient.setQueryData<SavedVerse[]>(
          ['savedVerses', userId],
          previousVerses.filter(v => v.id !== id)
        );
      }

      return { previousVerses };
    },
    onSuccess: () => {
      toast({ title: 'Verse removed' });
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousVerses) {
        queryClient.setQueryData(['savedVerses', userId], context.previousVerses);
      }
      toast({ title: 'Could not remove verse', variant: 'destructive' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savedVerses', userId] });
    }
  });

  // Legacy function for backward compatibility
  const addPericope = async (pericopeId: string) => {
    if (!userId) {
      toast({ title: 'Sign in required', description: 'Please sign in to save verses.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('user_saved_verses')
      .insert({
        user_id: userId,
        pericope_id: pericopeId
      });

    if (error) {
      toast({ title: 'Could not add', description: error.message, variant: 'destructive' });
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ['savedVerses', userId] });
    toast({ title: 'Verse added!' });
  };

  return {
    savedVerses,
    isLoading,
    addPericope,
    addCustomVerse: (book: string, chapter: number, startVerse: number, endVerse: number | null, customName: string | null) => {
      addCustomVerseMutation.mutate({ book, chapter, startVerse, endVerse, customName });
    },
    removeSavedVerse: removeSavedVerseMutation.mutate
  };
}
