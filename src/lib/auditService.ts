import { supabase } from "@/integrations/supabase/client";
import type { ParsedCard } from "@/lib/streamChat";

export interface AuditRecord {
  id: string;
  field: string;
  specialty: string;
  optimization: string;
  query: string;
  ai_response: string | null;
  created_at: string;
  recommendations: AuditRecommendation[];
}

export interface AuditRecommendation {
  id: string;
  audit_id: string;
  profile: string;
  material_name: string;
  category: string;
  score: number;
  sustainability: number;
  co2: number;
  cost: number;
  co2_saved: number;
}

export async function saveAudit(
  field: string,
  specialty: string,
  optimization: string,
  query: string,
  aiResponse: string,
  cards: ParsedCard[]
): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || "00000000-0000-0000-0000-000000000000";

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .insert({
      user_id: userId,
      field,
      specialty,
      optimization,
      query,
      ai_response: aiResponse,
    })
    .select("id")
    .single();

  if (auditError || !audit) {
    console.error("Failed to save audit:", auditError);
    return null;
  }

  if (cards.length > 0) {
    const recs = cards.map((c) => ({
      audit_id: audit.id,
      profile: c.profil,
      material_name: c.name,
      category: c.category,
      score: c.score,
      sustainability: c.sustainability,
      co2: c.co2,
      cost: c.cost,
      co2_saved: c.co2Saved,
    }));

    const { error: recError } = await supabase
      .from("audit_recommendations")
      .insert(recs);

    if (recError) console.error("Failed to save recommendations:", recError);
  }

  return audit.id;
}

export async function fetchAudits(): Promise<AuditRecord[]> {
  const { data: audits, error } = await supabase
    .from("audits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !audits) return [];

  const auditIds = audits.map((a: any) => a.id);
  const { data: recs } = await supabase
    .from("audit_recommendations")
    .select("*")
    .in("audit_id", auditIds);

  return audits.map((a: any) => ({
    ...a,
    recommendations: (recs || []).filter((r: any) => r.audit_id === a.id),
  }));
}
