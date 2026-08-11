'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { getChurch, type Church } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';

export default function ChurchReviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [church, setChurch] = useState<Church | null>(null);
  const [error, setError] = useState('');
  useRequireSuperAdmin();

  useEffect(() => {
    getChurch(id).then(setChurch).catch((reason) => setError(handleApiError(reason)));
  }, [id]);

  return (
    <>
      <AdminTopbar title="Church Details" />
      <div className="p-6">
        <button onClick={() => router.push('/admin/churches')} className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to Churches
        </button>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : !church ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div><h1 className="text-2xl font-bold text-gray-900">{church.name}</h1><p className="mt-1 text-sm capitalize text-gray-500">{church.status.replaceAll('_', ' ')}</p></div>
              <p className="text-sm text-gray-500">Submitted {new Date(church.submittedAt).toLocaleDateString()}</p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Representative', church.representativeName],
                ['Email', church.email],
                ['Phone', church.phone],
                ['Location', [church.area, church.governorate].filter(Boolean).join(', ')],
                ['Diocese', church.diocese],
                ['Responsible Priest', church.responsiblePriestName],
                ['Expected Children', church.expectedChildrenCount],
                ['Allowed Children', church.maxChildrenAllowed],
                ['Preferred Contact', church.preferredContactMethod],
                ['Requested Curricula', church.requestedCurriculumCodes.join(', ')],
                ['Notes', church.notes],
                ['Review Reason', church.rejectionReason],
              ].map(([label, value]) => (
                <div key={String(label)}><dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt><dd className="mt-1 text-sm text-gray-800">{value === undefined || value === '' ? 'Not provided' : value}</dd></div>
              ))}
            </dl>
            {church.status !== 'approved' && <p className="mt-8 border-t pt-6 text-sm text-gray-500">Use the review actions in the church queue to approve, reject, or request more information.</p>}
          </div>
        )}
      </div>
    </>
  );
}
