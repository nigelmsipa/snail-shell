import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
}

export function useAvailableVersions() {
  return useQuery({
    queryKey: ['available-versions'],
    queryFn: async (): Promise<BibleVersion[]> => {
      const { data, error } = await supabase
        .from('bible_versions')
        .select('id, name, abbreviation')
        .eq('is_active', true)
        .order('abbreviation');

      if (error) {
        console.error('Error fetching versions:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
