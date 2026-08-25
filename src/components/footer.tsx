import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-10 w-44">
                <Image
                  src="/logo.png"
                  alt="দেশ বার্তা লোগো"
                  fill
                  sizes="180px"
                  className="object-contain object-left dark:brightness-110"
                />
              </div>
            </Link>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed font-bengali max-w-md">
              বাংলাদেশ ও বিশ্বের সর্বশেষ এবং নির্ভরযোগ্য সংবাদ সবার আগে পৌঁছে দিতে
              প্রতিশ্রুতিবদ্ধ সংবাদ মাধ্যম। সত্য, নিরপেক্ষ ও বস্তুনিষ্ঠ সাংবাদিকতাই আমাদের মূল লক্ষ্য।
            </p>
          </div>

          {/* Categories Navigation */}
          <div className="md:col-span-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-surface-400 mb-4 font-bengali">
              সংবাদ বিভাগ
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ["politics", "রাজনীতি"],
                ["world", "বিশ্ব"],
                ["economics", "অর্থনীতি"],
                ["sports", "খেলাধুলা"],
                ["technology", "তথ্যপ্রযুক্তি"],
                ["health", "স্বাস্থ্য"],
                ["bangladesh", "বাংলাদেশ"],
                ["india", "ভারত"],
              ].map(([id, name]) => (
                <Link
                  key={id}
                  href={`/category/${id}`}
                  className="text-sm text-surface-600 dark:text-surface-400 hover:text-crimson-500 dark:hover:text-crimson-400 transition-colors font-bengali"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-surface-400 mb-4 font-bengali">
              গুরুত্বপূর্ণ লিংক
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="text-sm text-surface-600 dark:text-surface-400 hover:text-crimson-500 dark:hover:text-crimson-400 transition-colors font-bengali"
              >
                মূলপাতা
              </Link>
              <Link
                href="/category/politics"
                className="text-sm text-surface-600 dark:text-surface-400 hover:text-crimson-500 dark:hover:text-crimson-400 transition-colors font-bengali"
              >
                তাজা খবর
              </Link>
              <span className="text-xs text-surface-400 mt-2 font-mono">
                দেশ বার্তা • লাইভ নিউজ নেটওয়ার্ক
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-400 font-bengali">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-surface-600 dark:text-surface-300">দেশ বার্তা</span>। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-surface-400 font-bengali">
            বাংলাদেশের খবর, সবার আগে
          </p>
        </div>
      </div>
    </footer>
  );
}
