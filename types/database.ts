/**
 * types/database.ts
 *
 * TypeScript types for all database entities used in SitaanKu.
 */

/** A school class (e.g. "X RPL 1") */
export interface Class {
  id: string;
  name: string;          // e.g. "X RPL 1", "XI TKJ 2"
  grade: string;         // e.g. "X", "XI", "XII"
  total_students: number;
  created_at: string;
}

/** A confiscated item record linked to a class */
export interface ConfiscatedItem {
  id: string;
  class_id: string;
  item_type: string;     // e.g. "Celana pendek", "Tali pinggang", "HP"
  quantity: number;
  photo_url: string | null;
  confiscated_at: string;
  status: 'warning' | 'fined' | 'resolved';
  fine_amount: number;           // Rp 5000 × quantity after first offense
  notes: string | null;
  created_at: string;
}

/** Tracking warnings per class */
export interface ClassWarning {
  id: string;
  class_id: string;
  offense_count: number;   // how many times this class has been caught
  total_unpaid_fine: number;
  last_updated: string;
}

/** Cleanliness score entry per class per period */
export interface CleanlinessScore {
  id: string;
  class_id: string;
  period: string;          // e.g. "Week 1 - June 2026"
  score: number;           // 0-100
  checklist_data: Record<string, any>; // JSON: { sweeping: true, cleaning_waste_bin: false, ... }
  scored_at: string;
  scored_by: string;       // Supabase user ID
}

/**
 * Derived type for the class detail page combining confiscations + warnings.
 */
export interface ClassDetail {
  class: Class;
  confiscations: ConfiscatedItem[];
  warning: ClassWarning | null;
  latestScore: CleanlinessScore | null;
}

/** Query filter for confiscated items list */
export interface ConfiscationFilters {
  class_id?: string;
  status?: 'warning' | 'fined' | 'resolved';
  search?: string;
}
