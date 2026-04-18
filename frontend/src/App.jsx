import { useEffect, useState } from 'react'

const HEALTH_ENDPOINT = 'http://localhost:8080/api/health'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(HEALTH_ENDPOINT)
        const data = await response.json()

        setBackendStatus(response.ok && data.status === 'ok' ? 'connected' : 'disconnected')
      } catch {
        setBackendStatus('disconnected')
      }
    }

    checkBackendHealth()
  }, [])

  const isConnected = backendStatus === 'connected'
  const isChecking = backendStatus === 'checking'
  const statusClasses = isChecking
    ? 'border-amber-400/40 bg-amber-400/15 text-amber-100'
    : isConnected
      ? 'border-green-400/40 bg-green-500/20 text-green-100'
      : 'border-red-400/40 bg-red-500/20 text-red-100'
  const dotClasses = isChecking ? 'bg-amber-300' : isConnected ? 'bg-green-400' : 'bg-red-500'
  const statusText = isChecking
    ? 'Checking backend connection'
    : isConnected
      ? 'Backend connected'
      : 'Backend disconnected'

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
              Demo bootstrap ready
            </p>
            <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${statusClasses}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${dotClasses}`} aria-hidden="true" />
              {statusText}
            </p>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Codex Notes Board</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            This repository is intentionally bootstrapped with the minimum structure needed for a live multi-agent demo.
            Notes features should be implemented incrementally during the session.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium">Backend</h2>
            <p className="mt-2 text-sm text-slate-400">
              {isConnected ? 'Spring Boot is reachable from the frontend.' : 'Spring Boot is not reachable from the frontend.'}
            </p>
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
