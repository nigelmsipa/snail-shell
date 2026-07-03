export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bible_books: {
        Row: {
          abbreviation: string
          book_number: number
          created_at: string | null
          id: string
          name: string
          testament: string
          total_chapters: number
        }
        Insert: {
          abbreviation: string
          book_number: number
          created_at?: string | null
          id?: string
          name: string
          testament: string
          total_chapters: number
        }
        Update: {
          abbreviation?: string
          book_number?: number
          created_at?: string | null
          id?: string
          name?: string
          testament?: string
          total_chapters?: number
        }
        Relationships: []
      }
      bible_pericopes: {
        Row: {
          book_id: string | null
          chapter: number
          created_at: string | null
          display_order: number
          id: string
          lore: string | null
          name: string
          subtitle: string | null
          theme: string | null
          updated_at: string | null
          verse_count: number | null
          verse_end: number
          verse_start: number
        }
        Insert: {
          book_id?: string | null
          chapter: number
          created_at?: string | null
          display_order: number
          id?: string
          lore?: string | null
          name: string
          subtitle?: string | null
          theme?: string | null
          updated_at?: string | null
          verse_count?: number | null
          verse_end: number
          verse_start: number
        }
        Update: {
          book_id?: string | null
          chapter?: number
          created_at?: string | null
          display_order?: number
          id?: string
          lore?: string | null
          name?: string
          subtitle?: string | null
          theme?: string | null
          updated_at?: string | null
          verse_count?: number | null
          verse_end?: number
          verse_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_pericopes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verses: {
        Row: {
          abbreviated_text: string | null
          book_id: string | null
          chapter: number
          created_at: string | null
          id: string
          text: string
          verse: number
          version_id: string | null
        }
        Insert: {
          abbreviated_text?: string | null
          book_id?: string | null
          chapter: number
          created_at?: string | null
          id?: string
          text: string
          verse: number
          version_id?: string | null
        }
        Update: {
          abbreviated_text?: string | null
          book_id?: string | null
          chapter?: number
          created_at?: string | null
          id?: string
          text?: string
          verse?: number
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_verses_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_versions: {
        Row: {
          abbreviation: string
          copyright_info: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          language: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          abbreviation: string
          copyright_info?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          abbreviation?: string
          copyright_info?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collection_verses: {
        Row: {
          book: string
          chapter: number
          collection_id: string
          created_at: string | null
          display_order: number
          end_verse: number | null
          id: string
          start_verse: number
        }
        Insert: {
          book: string
          chapter: number
          collection_id: string
          created_at?: string | null
          display_order?: number
          end_verse?: number | null
          id?: string
          start_verse: number
        }
        Update: {
          book?: string
          chapter?: number
          collection_id?: string
          created_at?: string | null
          display_order?: number
          end_verse?: number | null
          id?: string
          start_verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_verses_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "user_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_activity: {
        Row: {
          activity_date: string
          reviews_completed: number | null
          user_id: string
          verses_typed: number | null
          xp_earned: number | null
        }
        Insert: {
          activity_date: string
          reviews_completed?: number | null
          user_id: string
          verses_typed?: number | null
          xp_earned?: number | null
        }
        Update: {
          activity_date?: string
          reviews_completed?: number | null
          user_id?: string
          verses_typed?: number | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      passage_tags: {
        Row: {
          created_at: string | null
          id: string
          passage_id: string
          tag: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          passage_id: string
          tag: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          passage_id?: string
          tag?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passage_tags_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "user_passages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          preferred_version: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          preferred_version?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          preferred_version?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progress: {
        Row: {
          average_score: number | null
          chapter_id: string
          completed: boolean
          confidence_rating: number | null
          created_at: string
          encoding_reps: number | null
          failure_count: number | null
          id: string
          last_difficulty: string | null
          last_reviewed_at: string | null
          last_score: number | null
          last_test_type: string | null
          next_review_at: string | null
          passage_id: string | null
          pericope_id: string
          retrieval_passed: boolean | null
          retrieval_unlocked: boolean | null
          review_count: number | null
          state: string | null
          success_count: number | null
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
          verse_number: number | null
          version: string | null
        }
        Insert: {
          average_score?: number | null
          chapter_id: string
          completed?: boolean
          confidence_rating?: number | null
          created_at?: string
          encoding_reps?: number | null
          failure_count?: number | null
          id?: string
          last_difficulty?: string | null
          last_reviewed_at?: string | null
          last_score?: number | null
          last_test_type?: string | null
          next_review_at?: string | null
          passage_id?: string | null
          pericope_id: string
          retrieval_passed?: boolean | null
          retrieval_unlocked?: boolean | null
          review_count?: number | null
          state?: string | null
          success_count?: number | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
          verse_number?: number | null
          version?: string | null
        }
        Update: {
          average_score?: number | null
          chapter_id?: string
          completed?: boolean
          confidence_rating?: number | null
          created_at?: string
          encoding_reps?: number | null
          failure_count?: number | null
          id?: string
          last_difficulty?: string | null
          last_reviewed_at?: string | null
          last_score?: number | null
          last_test_type?: string | null
          next_review_at?: string | null
          passage_id?: string | null
          pericope_id?: string
          retrieval_passed?: boolean | null
          retrieval_unlocked?: boolean | null
          review_count?: number | null
          state?: string | null
          success_count?: number | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
          verse_number?: number | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "user_passages"
            referencedColumns: ["id"]
          },
        ]
      }
      selected_chapters: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          order_index: number
          user_id: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          order_index: number
          user_id: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          order_index?: number
          user_id?: string
        }
        Relationships: []
      }
      user_collections: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_custom_quotes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          scripture_reference: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          scripture_reference?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          scripture_reference?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_passages: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          current_verse: number | null
          display_order: number | null
          id: string
          note: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          verse_end: number
          verse_start: number
          version_id: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          current_verse?: number | null
          display_order?: number | null
          id?: string
          note?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          verse_end: number
          verse_start: number
          version_id: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          current_verse?: number | null
          display_order?: number | null
          id?: string
          note?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verse_end?: number
          verse_start?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_passages_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_verses: {
        Row: {
          book: string | null
          chapter: number | null
          created_at: string | null
          custom_name: string | null
          end_verse: number | null
          id: string
          pericope_id: string | null
          start_verse: number | null
          user_id: string
        }
        Insert: {
          book?: string | null
          chapter?: number | null
          created_at?: string | null
          custom_name?: string | null
          end_verse?: number | null
          id?: string
          pericope_id?: string | null
          start_verse?: number | null
          user_id: string
        }
        Update: {
          book?: string | null
          chapter?: number | null
          created_at?: string | null
          custom_name?: string | null
          end_verse?: number | null
          id?: string
          pericope_id?: string | null
          start_verse?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_verses_pericope_id_fkey"
            columns: ["pericope_id"]
            isOneToOne: false
            referencedRelation: "bible_pericopes"
            referencedColumns: ["id"]
          },
        ]
      }
      verse_test_results: {
        Row: {
          accuracy_percent: number
          calculated_score: number
          confidence_rating: number | null
          created_at: string | null
          difficulty_weight: number
          id: string
          mistakes: string | null
          pericope_id: string
          test_type: string
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          accuracy_percent: number
          calculated_score: number
          confidence_rating?: number | null
          created_at?: string | null
          difficulty_weight?: number
          id?: string
          mistakes?: string | null
          pericope_id: string
          test_type: string
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          accuracy_percent?: number
          calculated_score?: number
          confidence_rating?: number | null
          created_at?: string | null
          difficulty_weight?: number
          id?: string
          mistakes?: string | null
          pericope_id?: string
          test_type?: string
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_daily_review_queue: {
        Row: {
          average_score: number | null
          last_score: number | null
          next_review_at: string | null
          pericope_id: string | null
          priority: number | null
          review_count: number | null
          state: string | null
          success_count: number | null
          user_id: string | null
        }
        Insert: {
          average_score?: number | null
          last_score?: number | null
          next_review_at?: string | null
          pericope_id?: string | null
          priority?: never
          review_count?: number | null
          state?: string | null
          success_count?: number | null
          user_id?: string | null
        }
        Update: {
          average_score?: number | null
          last_score?: number | null
          next_review_at?: string | null
          pericope_id?: string | null
          priority?: never
          review_count?: number | null
          state?: string | null
          success_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      abbreviate_verse_text: { Args: { full_text: string }; Returns: string }
      calculate_next_review: {
        Args: {
          last_reviewed_at: string
          state: string
          was_successful: boolean
        }
        Returns: string
      }
      calculate_next_state: {
        Args: { average_score: number; current_state: string }
        Returns: string
      }
      generate_abbreviated_text: {
        Args: { full_text: string }
        Returns: string
      }
      generate_all_abbreviated_text: { Args: never; Returns: undefined }
      update_daily_activity: {
        Args: {
          p_reviews_completed?: number
          p_user_id: string
          p_verses_typed?: number
          p_xp_earned?: number
        }
        Returns: undefined
      }
      update_progress_after_test: {
        Args: {
          p_calculated_score: number
          p_pericope_id: string
          p_test_type: string
          p_user_id: string
        }
        Returns: {
          new_average_score: number
          new_next_review: string
          new_state: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
