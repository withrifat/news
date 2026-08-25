"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="h-16 w-16 rounded-2xl bg-crimson-500/10 flex items-center justify-center mb-4">
        <svg
          className="h-8 w-8 text-crimson-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">কিছু ভুল হয়েছে</h2>
      <p className="text-surface-500 mb-6 text-center max-w-md">
        সংবাদ লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full bg-crimson-500 text-white font-medium hover:bg-crimson-600 transition-colors"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
