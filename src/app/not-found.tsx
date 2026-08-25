import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-[120px] font-bold text-surface-200 dark:text-surface-800 font-bengali leading-none">
        ৪০৪
      </div>
      <h2 className="text-2xl font-bold mt-4 mb-2">পৃষ্ঠা পাওয়া যায়নি</h2>
      <p className="text-surface-500 mb-8 text-center max-w-md">
        আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি বিদ্যমান নেই বা সরানো হয়েছে।
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-crimson-500 text-white font-medium hover:bg-crimson-600 transition-colors"
      >
        মূলপাতায় ফিরে যান
      </Link>
    </div>
  );
}
