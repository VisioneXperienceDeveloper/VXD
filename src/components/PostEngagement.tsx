'use client';

import { Eye } from 'lucide-react';

interface PostEngagementProps {
  viewCount?: number;
}

export function PostEngagement({ viewCount }: PostEngagementProps) {
  return (
    <div className="flex justify-end items-center gap-6 my-4">
      {/* View Count */}
      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
        <Eye className="w-5 h-5" />
        <span className="text-sm font-medium">
          {viewCount !== undefined ? viewCount.toLocaleString() : 0}
        </span>
      </div>

      {/* Future: Like Button */}
      {/* <button className="flex items-center gap-2">
        <Heart className="w-5 h-5" />
        <span>0</span>
      </button> */}

      {/* Future: Share Button */}
      {/* <button className="flex items-center gap-2">
        <Share2 className="w-5 h-5" />
      </button> */}
    </div>
  );
}
