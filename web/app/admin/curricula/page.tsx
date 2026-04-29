/**
 * Curricula Page
 * Placeholder for Phase 2 — displays the 5 planned curricula
 */

'use client';

import { useRequireAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { BookOpen, Clock } from 'lucide-react';

interface CurriculumInfo {
  id: number;
  name: string;
  nameAr: string;
  ageGroup: string;
  grades: string;
  description: string;
  status: 'planned';
}

// 5 curricula from the Bible School project docs
const CURRICULA: CurriculumInfo[] = [
  {
    id: 1,
    name: 'Seeds',
    nameAr: 'البذور',
    ageGroup: 'Pre-school',
    grades: 'Nursery – KG2',
    description: 'Foundation Bible stories and basic faith concepts for the youngest students.',
    status: 'planned',
  },
  {
    id: 2,
    name: 'Sprouts',
    nameAr: 'البراعم',
    ageGroup: 'Primary',
    grades: 'Grade 1 – 3',
    description: 'Introduction to Old Testament stories, prayer, and church life.',
    status: 'planned',
  },
  {
    id: 3,
    name: 'Branches',
    nameAr: 'الأغصان',
    ageGroup: 'Elementary',
    grades: 'Grade 4 – 6',
    description: 'Deeper exploration of Scripture, the Coptic calendar, and saints.',
    status: 'planned',
  },
  {
    id: 4,
    name: 'Roots',
    nameAr: 'الجذور',
    ageGroup: 'Middle School',
    grades: 'Grade 7 – 9',
    description: 'Orthodox theology, church history, and apologetics for adolescents.',
    status: 'planned',
  },
  {
    id: 5,
    name: 'Fruits',
    nameAr: 'الثمار',
    ageGroup: 'High School',
    grades: 'Grade 10 – 12',
    description: 'Advanced faith formation, leadership, and ministry preparation.',
    status: 'planned',
  },
];

export default function CurriculaPage() {
  useRequireAdmin();

  return (
    <>
      <AdminTopbar title="Curricula" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curricula</h1>
            <p className="text-gray-600 mt-1">
              Five age-based Bible School curricula — backend coming in Phase 2
            </p>
          </div>

          {/* Coming soon badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" />
            Phase 2
          </span>
        </div>

        {/* Curricula Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURRICULA.map((curriculum) => (
            <div
              key={curriculum.id}
              className="bg-white rounded-2xl shadow p-6 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors"
            >
              {/* Icon + number */}
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-200">
                  #{curriculum.id}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-gray-900">
                {curriculum.name}
              </h3>
              <p className="text-base text-gray-500 mb-1">{curriculum.nameAr}</p>

              {/* Age / grade badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {curriculum.ageGroup}
                </span>
                <span className="text-xs text-gray-500">{curriculum.grades}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600">{curriculum.description}</p>

              {/* Status */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-xs text-yellow-700">
                  <Clock className="w-3 h-3" />
                  Backend implementation — Phase 2
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 2 features notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Phase 2 — Curriculum Engine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-800">
            {[
              'Weekly lesson auto open/close scheduler (BullMQ)',
              'Student progress tracking per curriculum',
              'Assessment & scoring system',
              'Student promotion between curricula',
              'Attendance via QR code scanning',
              'Leaderboard & gamification',
              'PDF lesson content viewer',
              'Push notifications (Firebase FCM)',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
