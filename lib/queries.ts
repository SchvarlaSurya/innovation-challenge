/**
 * lib/queries.ts
 *
 * Centralized Supabase query helpers for clean data access from Server Components.
 * Uses the anon key (public) — RLS policies enforce access control.
 */
import { createAuthClient } from './supabase-server';
import type {
  Class,
  ConfiscatedItem,
  ClassWarning,
  CleanlinessScore,
  ClassDetail,
} from '@/types';

// =============================================================
// CLASSES
// =============================================================

/** Get all classes (sorted by name) */
export async function getAllClasses(): Promise<Class[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Class[];
}

/** Search classes by name (for landing page search) */
export async function searchClasses(query: string): Promise<Class[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(20);

  if (error) throw new Error(error.message);
  return (data ?? []) as Class[];
}

/** Get a single class by id */
export async function getClassById(id: string): Promise<Class | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as Class;
}

// =============================================================
// CONFISCATED ITEMS
// =============================================================

/** Get all confiscated items for a class */
export async function getConfiscationsByClass(classId: string): Promise<ConfiscatedItem[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('confiscated_items')
    .select('*')
    .eq('class_id', classId)
    .order('confiscated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ConfiscatedItem[];
}

/** Get a single confiscated item by id */
export async function getConfiscationById(id: string): Promise<ConfiscatedItem | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('confiscated_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as ConfiscatedItem;
}

/** Get all confiscations (admin list with filters) */
export async function getAllConfiscations(filters: {
  class_id?: string;
  status?: 'warning' | 'fined' | 'resolved';
} = {}): Promise<ConfiscatedItem[]> {
  const supabase = await createAuthClient();
  let query = supabase
    .from('confiscated_items')
    .select('*')
    .order('confiscated_at', { ascending: false });

  if (filters.class_id) query = query.eq('class_id', filters.class_id);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ConfiscatedItem[];
}

/** Get all confiscations joined with class names (for admin list display) */
export async function getAllConfiscationsWithClass() {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('confiscated_items')
    .select(`
      *,
      classes:class_id ( id, name, grade )
    `)
    .order('confiscated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// =============================================================
// CLASS WARNINGS
// =============================================================

/** Get the warning record for a single class */
export async function getWarningByClass(classId: string): Promise<ClassWarning | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('class_warnings')
    .select('*')
    .eq('class_id', classId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ClassWarning | null;
}

/** Get warning records for all classes (admin dashboard) */
export async function getAllWarnings(): Promise<ClassWarning[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('class_warnings')
    .select('*');

  if (error) throw new Error(error.message);
  return (data ?? []) as ClassWarning[];
}

// =============================================================
// CLEANLINESS SCORES
// =============================================================

/** Get all cleanliness scores for a class */
export async function getScoresByClass(classId: string): Promise<CleanlinessScore[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('cleanliness_scores')
    .select('*')
    .eq('class_id', classId)
    .order('scored_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as CleanlinessScore[];
}

/** Get latest cleanliness score per class (for leaderboard) */
export async function getLatestScoresForAllClasses() {
  const supabase = await createAuthClient();

  // We pull all scores with class info, then group by class.
  const { data, error } = await supabase
    .from('cleanliness_scores')
    .select(`
      *,
      classes:class_id ( id, name, grade )
    `)
    .order('scored_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Keep only the latest score per class_id
  const latestByClass = new Map<string, any>();
  (data ?? []).forEach((entry: any) => {
    if (!latestByClass.has(entry.class_id)) {
      latestByClass.set(entry.class_id, entry);
    }
  });

  return Array.from(latestByClass.values());
}

/** Get the most recent score for one class */
export async function getLatestScoreForClass(classId: string): Promise<CleanlinessScore | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from('cleanliness_scores')
    .select('*')
    .eq('class_id', classId)
    .order('scored_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as CleanlinessScore | null;
}

// =============================================================
// COMPOSITE
// =============================================================

/** Build the full class detail view (class + confiscations + warning + latest score) */
export async function getClassDetail(classId: string): Promise<ClassDetail | null> {
  const [classData, confiscations, warning, latestScore] = await Promise.all([
    getClassById(classId),
    getConfiscationsByClass(classId),
    getWarningByClass(classId),
    getLatestScoreForClass(classId),
  ]);

  if (!classData) return null;
  return {
    class: classData,
    confiscations,
    warning,
    latestScore,
  };
}

/** Compute admin dashboard summary stats */
export async function getAdminSummary() {
  const [confiscations, warnings] = await Promise.all([
    getAllConfiscations(),
    getAllWarnings(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysConfiscations = confiscations.filter(
    (c) => c.confiscated_at.slice(0, 10) === today,
  );

  const activeConfiscations = confiscations.filter((c) => c.status !== 'resolved');
  const totalFines = activeConfiscations.reduce((sum, c) => sum + c.fine_amount, 0);

  return {
    activeConfiscations: activeConfiscations.length,
    totalFines,
    todaysConfiscations: todaysConfiscations.length,
    totalConfiscations: confiscations.length,
    resolvedConfiscations: confiscations.length - activeConfiscations.length,
  };
}
