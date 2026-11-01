'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/ui/CustomSelect';

export default function CBTAttemptSwitcher({ paperSlug, allAttempts = [], currentSubmissionId }) {
  const router = useRouter();

  const totalCount = allAttempts?.length || 0;

  const currentIndex = (allAttempts || []).findIndex(
    (a) => String(a._id) === String(currentSubmissionId)
  );

  const currentAttempt = allAttempts?.[currentIndex !== -1 ? currentIndex : 0] || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectAttempt = (submissionId) => {
    router.push(`/mock-test/${paperSlug}/results?submission=${submissionId}`);
  };

  const attemptOptions = useMemo(() => {
    if (!Array.isArray(allAttempts)) return [];
    return allAttempts.map((att, idx) => {
      const attNum = totalCount - idx;
      const isLatest = idx === 0;
      const score = att.summary?.total_score ?? 0;
      const max = att.summary?.max_marks ?? 300;
      const dateLabel = formatDate(att.submitted_at || att.started_at);
      return {
        value: String(att._id),
        label: `Attempt #${attNum}${isLatest ? ' (Latest)' : ''} • ${score}/${max} (${dateLabel})`,
      };
    });
  }, [allAttempts, totalCount]);

  if (!allAttempts || allAttempts.length === 0) return null;

  return (
    <div className="flex items-center">
      <div className="w-64 sm:w-80">
        <CustomSelect
          value={String(currentAttempt?._id)}
          onChange={handleSelectAttempt}
          options={attemptOptions}
          size="sm"
        />
      </div>
    </div>
  );
}
