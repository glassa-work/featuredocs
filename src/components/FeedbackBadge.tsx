interface FeedbackBadgeProps {
  count: number;
}

export default function FeedbackBadge({ count }: FeedbackBadgeProps) {
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-2 py-0.5 text-xs font-medium text-[#E65100]">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M5 3v2.5M5 7h.005"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {count} {count === 1 ? "report" : "reports"}
    </span>
  );
}
