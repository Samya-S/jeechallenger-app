'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementViewCount, getViewCount } from '@/server/views-actions';

export default function ViewCounter({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const handleViews = async () => {
      const viewed = sessionStorage.getItem(`viewed:${slug}`);

      if (!viewed) {
        // Increment on first view this session
        const newViews = await incrementViewCount(slug);
        if (newViews !== null) {
          setViews(newViews);
          sessionStorage.setItem(`viewed:${slug}`, 'true');
        }
      } else {
        // Just fetch existing count if already viewed
        const currentViews = await getViewCount(slug);
        if (currentViews !== null) {
          setViews(currentViews);
        }
      }
    };

    handleViews();
  }, [slug]);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <Eye size={18} />
      <span>{views.toLocaleString()} {views === 1 ? 'view' : 'views'}</span>
    </div>
  );
}