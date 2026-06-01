import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight">Next.js Template</h1>
        <p className="mt-4 text-lg text-gray-300">
          A minimal starting point with TypeScript, Tailwind CSS v4, and the App Router.
          Replace this section with your own product details.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-gray-200"
          >
            Open Dashboard
          </Link>
          <Link
            href="/api/health"
            className="rounded-md border border-gray-700 px-5 py-2.5 text-sm font-medium hover:border-gray-500 hover:text-gray-200"
          >
            Check API
          </Link>
        </div>

        <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-6">
            <h2 className="text-base font-semibold">Fast refresh</h2>
            <p className="mt-2 text-sm text-gray-400">Hot reload your UI without losing component state.</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-6">
            <h2 className="text-base font-semibold">File-based routing</h2>
            <p className="mt-2 text-sm text-gray-400">Organize pages directly under src/app.</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-6">
            <h2 className="text-base font-semibold">Tailwind CSS v4</h2>
            <p className="mt-2 text-sm text-gray-400">Build with composable utility classes.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
