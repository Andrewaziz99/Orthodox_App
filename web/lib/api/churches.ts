import { graphyApi } from './client';

export type ChurchReviewStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'needs_more_info';

export interface Church {
  id: string;
  name: string;
  representativeName?: string;
  phone?: string;
  email?: string;
  governorate?: string;
  area?: string;
  diocese?: string;
  responsiblePriestName?: string;
  expectedChildrenCount?: number;
  maxChildrenAllowed: number;
  requestedCurriculumCodes: string[];
  notes?: string;
  preferredContactMethod: string;
  status: ChurchReviewStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  activation?: {
    otpId: string;
    expiresAt: string;
    devCode?: string;
  };
}

interface GraphyChurch extends Record<string, unknown> {
  id: string;
  name: string;
  representative_name?: string | null;
  representative_phone?: string | null;
  representative_email?: string | null;
  governorate?: string | null;
  area?: string | null;
  diocese?: string | null;
  responsible_priest_name?: string | null;
  expected_children_count?: number | null;
  max_children_allowed: number;
  requested_curriculum_codes?: string[];
  notes?: string | null;
  preferred_contact_method: string;
  rejection_reason?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
  church_statuses?: { code: ChurchReviewStatus };
  activation?: Church['activation'];
}

export interface ChurchListQuery {
  status?: ChurchReviewStatus;
}

export interface ReviewChurchRequest {
  decision: Exclude<ChurchReviewStatus, 'pending_review'>;
  maxChildrenAllowed?: number;
  rejectionReason?: string;
}

function normalizeChurch(raw: GraphyChurch, status?: ChurchReviewStatus): Church {
  return {
    id: raw.id,
    name: raw.name,
    representativeName: raw.representative_name ?? undefined,
    phone: raw.representative_phone ?? undefined,
    email: raw.representative_email ?? undefined,
    governorate: raw.governorate ?? undefined,
    area: raw.area ?? undefined,
    diocese: raw.diocese ?? undefined,
    responsiblePriestName: raw.responsible_priest_name ?? undefined,
    expectedChildrenCount: raw.expected_children_count ?? undefined,
    maxChildrenAllowed: raw.max_children_allowed,
    requestedCurriculumCodes: raw.requested_curriculum_codes ?? [],
    notes: raw.notes ?? undefined,
    preferredContactMethod: raw.preferred_contact_method,
    status: status ?? raw.church_statuses?.code ?? 'pending_review',
    rejectionReason: raw.rejection_reason ?? undefined,
    submittedAt: raw.submitted_at,
    reviewedAt: raw.reviewed_at ?? undefined,
    activation: raw.activation,
  };
}

export async function getChurches(query: ChurchListQuery = {}): Promise<Church[]> {
  const suffix = query.status ? `?status=${encodeURIComponent(query.status)}` : '';
  const churches = await graphyApi.get<GraphyChurch[]>(`/churches${suffix}`);
  return churches.map((church) => normalizeChurch(church));
}

export async function getChurch(id: string): Promise<Church> {
  return normalizeChurch(await graphyApi.get<GraphyChurch>(`/churches/${id}`));
}

export async function reviewChurch(id: string, review: ReviewChurchRequest): Promise<Church> {
  const church = await graphyApi.patch<GraphyChurch>(`/churches/${id}/review`, review);
  return normalizeChurch(church, review.decision);
}
