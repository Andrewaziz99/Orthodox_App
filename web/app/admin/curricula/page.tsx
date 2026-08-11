'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { getEducationalCurricula, type EducationalCurriculum } from '@/lib/api/curricula';
import { useRequireAdmin } from '@/lib/auth/middleware';

export default function CurriculaPage() {
  useRequireAdmin();
  const [curricula, setCurricula] = useState<EducationalCurriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEducationalCurricula()
      .then(setCurricula)
      .catch(() => setError('Unable to load curricula from Graphy.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminTopbar title="Curricula" />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Educational Curricula</h1>
          <p className="mt-1 text-gray-600">Curricula available to this Graphy account.</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><Clock className="h-7 w-7 animate-pulse text-blue-600" /></div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error}</div>
        ) : curricula.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">No curricula are available for this account.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {curricula.map((curriculum) => (
              <article key={curriculum.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-blue-100 p-3"><BookOpen className="h-6 w-6 text-blue-600" /></div>
                  <span className="text-sm font-bold text-gray-300">#{curriculum.sequenceOrder}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{curriculum.name}</h2>
                {curriculum.tagline && <p className="mt-1 text-sm font-medium text-blue-600">{curriculum.tagline}</p>}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-700">{curriculum.durationYears} year{curriculum.durationYears === 1 ? '' : 's'}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{curriculum.minGradeCode} to {curriculum.maxGradeCode}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{curriculum.description || curriculum.suitableFor || 'No description provided.'}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
