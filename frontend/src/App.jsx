function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
            Demo bootstrap ready
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Codex Notes Board</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            This repository is intentionally bootstrapped with the minimum structure needed for a live multi-agent demo.
            Notes features should be implemented incrementally during the session.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium">Backend</h2>
            <p className="mt-2 text-sm text-slate-400">Spring Boot skeleton ready for note-related tasks.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium">Frontend</h2>
            <p className="mt-2 text-sm text-slate-400">React + Vite + Tailwind base ready for visual iterations.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium">Workflow</h2>
            <p className="mt-2 text-sm text-slate-400">Agent skills drive planning, implementation, review, and refinement.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
