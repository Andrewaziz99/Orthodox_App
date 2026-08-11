/**
 * Edit Church Page (client wrapper)
 */

'use client';

import ChurchReviewClient from '../_components/ChurchReviewClient';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';

export default function ChurchDetailPage() {
  useRequireSuperAdmin();
  return <ChurchReviewClient />;
}
