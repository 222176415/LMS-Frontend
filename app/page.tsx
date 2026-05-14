import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="text-lg font-bold tracking-tighter uppercase">
          LMS.Core
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-neutral-500 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/login">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-md px-6 h-10 font-medium text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase border border-neutral-200 bg-neutral-50">
          Multi-Tenant Architecture v3.0.0
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          LOANS MANAGED <br />
          <span className="text-neutral-400">WITH PRECISION.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-neutral-500 text-lg md:text-xl mb-12 leading-relaxed">
          The high-performance engine for secure loan issuance, automated
          tracking, and real-time audit logs. Engineered for speed, built for
          reliability.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-neutral-900 text-white rounded-lg h-14 px-10 text-base"
          >
            Request Access
          </Button>
          <Link href="/docs" className="w-full md:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-md h-14 px-10 border-neutral-200 text-base font-medium hover:bg-neutral-50 transition-all"
            >
              Read Documentation
            </Button>
          </Link>
        </div>
      </main>

      {/* Trust Section */}
      <section className="relative z-10 py-20 border-t border-neutral-100 bg-neutral-50/50">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-12 grayscale opacity-50">
          <span className="font-bold text-xl">FINTECH</span>
          <span className="font-bold text-xl">ENTERPRISE</span>
          <span className="font-bold text-xl">SECURE</span>
          <span className="font-bold text-xl">SCALABLE</span>
        </div>
      </section>
    </div>
  );
}
