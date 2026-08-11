import { graphyApi } from './client';

export interface EducationalCurriculum {
  id: string;
  name: string;
  sequenceOrder: number;
  durationYears: number;
  minGradeCode: string;
  maxGradeCode: string;
  description?: string;
  tagline?: string;
  theme?: string;
  suitableFor?: string;
  heroImageUrl?: string;
}

interface GraphyCurriculum {
  id: string;
  name: string;
  sequence_order: number;
  duration_years: number;
  minGradeCode: string;
  maxGradeCode: string;
  description?: string | null;
  tagline?: string | null;
  theme?: string | null;
  suitable_for?: string | null;
  hero_image_url?: string | null;
}

export async function getEducationalCurricula(): Promise<EducationalCurriculum[]> {
  const curricula = await graphyApi.get<GraphyCurriculum[]>('/curricula');
  return curricula.map((curriculum) => ({
    id: curriculum.id,
    name: curriculum.name,
    sequenceOrder: curriculum.sequence_order,
    durationYears: curriculum.duration_years,
    minGradeCode: curriculum.minGradeCode,
    maxGradeCode: curriculum.maxGradeCode,
    description: curriculum.description ?? undefined,
    tagline: curriculum.tagline ?? undefined,
    theme: curriculum.theme ?? undefined,
    suitableFor: curriculum.suitable_for ?? undefined,
    heroImageUrl: curriculum.hero_image_url ?? undefined,
  }));
}
