import Link from "next/link";
import type { Feature } from "@/lib/types";
import FeedbackBadge from "./FeedbackBadge";

interface FeatureCardProps {
  feature: Feature;
  productSlug: string;
  version: string;
  feedbackCount: number;
}

export default function FeatureCard({
  feature,
  productSlug,
  version,
  feedbackCount,
}: FeatureCardProps) {
  return (
    <Link
      href={`/${productSlug}/${feature.slug}/${version}`}
      className="group block rounded-lg border border-[#E8E6E1] bg-white p-6 transition-all hover:border-[#C8C6C1] hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] group-hover:opacity-80 transition-opacity">
              {feature.title}
            </h3>
            {feature.isNew && (
              <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-2 py-0.5 text-xs font-medium text-[#2E7D32]">
                New
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
            {feature.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {feedbackCount > 0 && <FeedbackBadge count={feedbackCount} />}
          {feature.video && (
            <span className="text-xs text-[#6B6B6B]">
              <VideoIcon />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function VideoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <path
        d="M3 3.5A1.5 1.5 0 0 1 4.5 2h7A1.5 1.5 0 0 1 13 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9ZM6.5 5.5v5l4-2.5-4-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
