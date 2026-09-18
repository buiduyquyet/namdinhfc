export default function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" className={`navigation-arrow ${className}`}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
