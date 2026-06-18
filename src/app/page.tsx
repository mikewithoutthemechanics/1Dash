export default function Home() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <BackgroundGrid />
      <Header />
      <Hero />
      <Modules />
      <Metrics />
      <Footer />
    </main>
  );
}

function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 grid-fade"
    />
  );
}

function Header() {
  return (
    <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-6">
      <a href="/" className="flex items-center gap-2 font-mono text-sm tracking-tight">
        <Mark />
        <span>1dash</span>
      </a>
      <nav className="hidden gap-8 text-sm text-[color:var(--color-fg-muted)] md:flex">
        <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#modules">Modules</a>
        <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#metrics">Signals</a>
        <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#changelog">Changelog</a>
      </nav>
      <div className="flex items-center gap-3">
        <a
          href="#install"
          className="hidden text-sm text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)] md:inline"
        >
          Sign in
        </a>
        <a
          href="#install"
          className="rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3 py-1.5 text-sm transition-colors hover:bg-[color:var(--color-surface-2)]"
        >
          Install
        </a>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className="text-[color:var(--color-accent)]"
      aria-hidden
    >
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-3xl">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3 py-1 font-mono text-xs text-[color:var(--color-fg-muted)]">
          <span className="size-1.5 rounded-full bg-[color:var(--color-accent)]" />
          v0.4 — now with webhook lanes
        </p>
        <h1 className="text-balance text-5xl leading-[1.05] tracking-tighter md:text-7xl">
          One pane for everything{" "}
          <span className="text-[color:var(--color-fg-muted)]">that runs.</span>
        </h1>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-[color:var(--color-fg-muted)]">
          1Dash stitches the dashboards, status pages, and alerts you already trust
          into a single quiet surface. Built for builders who have outgrown their
          fifteenth browser tab.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#install"
            className="group inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-[color:var(--color-canvas)] transition-transform hover:-translate-y-px"
          >
            <span>Get the source</span>
            <ArrowRight />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-line)] px-4 py-2 text-sm text-[color:var(--color-fg-muted)] transition-colors hover:bg-[color:var(--color-surface)]"
          >
            Live preview
          </a>
        </div>
      </div>

      <Terminal />
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Terminal() {
  const lines = [
    { prompt: "$", text: "npx 1dash init" },
    { muted: "→ linked 4 modules · synced 312 metrics" },
    { prompt: "$", text: "1dash serve" },
    { muted: "→ listening on http://localhost:7878" },
    { dim: "# one pane. zero noise." },
  ];
  return (
    <div className="mt-16 overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-center gap-2 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[color:var(--color-fg-dim)]" />
        <span className="size-2.5 rounded-full bg-[color:var(--color-fg-dim)]" />
        <span className="size-2.5 rounded-full bg-[color:var(--color-fg-dim)]" />
        <span className="ml-2 font-mono text-xs text-[color:var(--color-fg-dim)]">~/projects/personal/lab</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
        {lines.map((l, i) => {
          if ("muted" in l) {
            return <div key={i} className="text-[color:var(--color-fg-muted)]">{l.muted}</div>;
          }
          if ("dim" in l) {
            return <div key={i} className="text-[color:var(--color-fg-dim)]">{l.dim}</div>;
          }
          return (
            <div key={i}>
              <span className="text-[color:var(--color-accent)]">{l.prompt}</span>
              <span className="ml-3 text-[color:var(--color-fg)]">{l.text}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

type Module = {
  code: string;
  title: string;
  blurb: string;
  meta: string;
};

function Modules() {
  const modules: Module[] = [
    { code: "01", title: "Metrics lane", blurb: "Pull time-series from Prometheus, Vercel, Stripe. Render in seconds, not minutes.", meta: "12 sources" },
    { code: "02", title: "Webhook lanes", blurb: "Triage incoming events from GitHub, Linear, Stripe, and your own services.", meta: "8ms p50" },
    { code: "03", title: "Status surfacing", blurb: "Aggregate third-party status. Cut through fragmented incident pages.", meta: "42 providers" },
    { code: "04", title: "Log search", blurb: "Local-first search across structured logs. Encrypted at rest, full-text in 80ms.", meta: "local-only" },
  ];

  return (
    <section id="modules" className="mx-auto max-w-[1400px] px-6 py-20">
      <SectionHeader
        eyebrow="01 / Modules"
        title="Built from four lanes, not fifty toggles."
        sub="Each module is optional, composable, and ships with sane defaults."
      />

      <div className="mt-12 grid grid-cols-1 gap-px bg-[color:var(--color-line)] md:grid-cols-2 xl:grid-cols-4">
        {modules.map((m) => (
          <article
            key={m.code}
            className="group relative flex flex-col gap-4 bg-[color:var(--color-canvas)] p-6 transition-colors hover:bg-[color:var(--color-surface)]"
          >
            <span className="font-mono text-xs text-[color:var(--color-fg-dim)]">{m.code}</span>
            <h3 className="text-xl tracking-tight">{m.title}</h3>
            <p className="text-sm leading-relaxed text-[color:var(--color-fg-muted)]">{m.blurb}</p>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs">
              <span className="font-mono text-[color:var(--color-fg-dim)]">{m.meta}</span>
              <ArrowRight />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metrics() {
  const cells = [
    { label: "active lanes", value: "4", trend: "+1 this week" },
    { label: "metrics cached", value: "1,284", trend: "avg 12s / source" },
    { label: "events / hr", value: "917", trend: "p95 8ms" },
    { label: "incidents tracked", value: "12", trend: "3 this week" },
  ];

  const timeline = [
    { time: "02:14", lane: "metrics", text: "Prometheus scrape complete", kind: "ok" },
    { time: "02:11", lane: "webhook", text: "github.push · main", kind: "ok" },
    { time: "02:08", lane: "status", text: "vercel · degraded → healthy", kind: "ok" },
    { time: "02:02", lane: "metric", text: "request.p95 > 240ms", kind: "warn" },
    { time: "01:58", lane: "webhook", text: "linear.issue.created", kind: "ok" },
    { time: "01:50", lane: "status", text: "stripe · operational", kind: "ok" },
  ];

  return (
    <section id="metrics" className="mx-auto max-w-[1400px] px-6 py-20">
      <SectionHeader
        eyebrow="02 / Live signals"
        title="Quiet by default. Loud when it matters."
        sub="A real-time read of your system without the noise of an open NOC tab."
      />

      <div className="mt-12 grid grid-cols-1 gap-px bg-[color:var(--color-line)] lg:grid-cols-[2fr_1fr]">
        <div className="bg-[color:var(--color-canvas)] p-6">
          <div className="grid grid-cols-2 gap-px bg-[color:var(--color-line)] sm:grid-cols-4">
            {cells.map((c) => (
              <div key={c.label} className="bg-[color:var(--color-canvas)] p-5">
                <div className="font-mono text-xs text-[color:var(--color-fg-dim)]">{c.label}</div>
                <div className="num-mono mt-3 text-4xl tracking-tighter">{c.value}</div>
                <div className="mt-2 text-xs text-[color:var(--color-fg-muted)]">{c.trend}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-end gap-1 px-2" style={{ height: 160 }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 20 + Math.round(Math.abs(Math.sin(i * 0.6)) * 110 + (i % 7) * 3);
              const hot = i % 11 === 0;
              return (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className={
                    "w-full rounded-sm " +
                    (hot
                      ? "bg-[color:var(--color-accent)]"
                      : "bg-[color:var(--color-surface-2)]")
                  }
                />
              );
            })}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-[color:var(--color-fg-dim)]">
            <span>-40m</span>
            <span>-20m</span>
            <span>now</span>
          </div>
        </div>

        <aside className="bg-[color:var(--color-canvas)] p-6">
          <h4 className="font-mono text-xs text-[color:var(--color-fg-dim)]">Recent activity</h4>
          <ol className="mt-4 space-y-3 text-sm">
            {timeline.map((row, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="num-mono w-12 shrink-0 font-mono text-xs text-[color:var(--color-fg-dim)]">
                  {row.time}
                </span>
                <span
                  className={
                    "mt-1.5 size-1.5 shrink-0 rounded-full " +
                    (row.kind === "warn"
                      ? "bg-amber-400"
                      : "bg-[color:var(--color-accent)]")
                  }
                />
                <div className="flex-1">
                  <span className="font-mono text-xs text-[color:var(--color-fg-muted)]">{row.lane}</span>
                  <p className="leading-snug">{row.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
      <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-fg-dim)]">
        {eyebrow}
      </div>
      <div className="max-w-[60ch]">
        <h2 className="text-balance text-3xl leading-[1.1] tracking-tighter md:text-4xl">
          {title}
        </h2>
        {sub ? (
          <p className="mt-3 text-base text-[color:var(--color-fg-muted)]">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-[color:var(--color-line)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-10 text-sm text-[color:var(--color-fg-muted)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-mono">
          <Mark />
          <span>1dash</span>
          <span className="ml-2 text-[color:var(--color-fg-dim)]">© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex flex-wrap gap-6">
          <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#">GitHub</a>
          <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#">Docs</a>
          <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#">Changelog</a>
          <a className="transition-colors hover:text-[color:var(--color-fg)]" href="#">Status</a>
        </nav>
      </div>
    </footer>
  );
}
