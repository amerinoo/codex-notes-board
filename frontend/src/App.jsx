import { useEffect, useMemo, useState } from 'react'

const NOTES_ENDPOINT = 'http://localhost:8080/api/notes'
const PRIORITIES = {
  Alta: {
    label: 'Alta',
    lightCard: 'border-red-200 bg-red-50',
    darkCard: 'border-red-400/40 bg-red-950/30',
    badge: 'border-red-200 bg-red-100 text-red-700',
    darkBadge: 'border-red-400/50 bg-red-900/60 text-red-100',
  },
  Media: {
    label: 'Media',
    lightCard: 'border-amber-200 bg-amber-50',
    darkCard: 'border-amber-300/40 bg-amber-950/30',
    badge: 'border-amber-200 bg-amber-100 text-amber-800',
    darkBadge: 'border-amber-300/50 bg-amber-900/60 text-amber-100',
  },
  Baja: {
    label: 'Baja',
    lightCard: 'border-emerald-200 bg-emerald-50',
    darkCard: 'border-emerald-300/40 bg-emerald-950/30',
    badge: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    darkBadge: 'border-emerald-300/50 bg-emerald-900/60 text-emerald-100',
  },
}
const PRIORITY_OPTIONS = Object.keys(PRIORITIES)
const VISIBILITY_OPTIONS = ['PUBLIC', 'PRIVATE']
const DEFAULT_PRIORITY = 'Media'
const EMPTY_FORM = { title: '', content: '', priority: DEFAULT_PRIORITY, visibility: 'PUBLIC' }

function App() {
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState('dark')
  const [loginName, setLoginName] = useState('')
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    loadNotes()
  }, [currentUser])

  const isEditing = editingNoteId !== null
  const isDark = theme === 'dark'
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredNotes = useMemo(() => {
    if (!normalizedSearch) {
      return notes
    }

    return notes.filter((note) => {
      const title = note.title?.toLowerCase() || ''
      const content = note.content?.toLowerCase() || ''
      return title.includes(normalizedSearch) || content.includes(normalizedSearch)
    })
  }, [notes, normalizedSearch])

  const priorityCounts = useMemo(() => {
    return PRIORITY_OPTIONS.reduce((counts, priority) => {
      counts[priority] = notes.filter((note) => (note.priority || DEFAULT_PRIORITY) === priority).length
      return counts
    }, {})
  }, [notes])

  const noteCountLabel = useMemo(() => {
    if (notes.length === 1) {
      return '1 note'
    }

    return `${notes.length} notes`
  }, [notes.length])

  async function loadNotes() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(NOTES_ENDPOINT, requestOptions())

      if (!response.ok) {
        throw new Error('Notes could not be loaded.')
      }

      setNotes(await response.json())
    } catch {
      setErrorMessage('The notes API is not available.')
    } finally {
      setIsLoading(false)
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function startEditing(note) {
    setEditingNoteId(note.id)
    setForm({
      title: note.title,
      content: note.content,
      priority: note.priority || DEFAULT_PRIORITY,
      visibility: note.visibility || 'PUBLIC',
    })
    setErrorMessage('')
  }

  function resetForm() {
    setEditingNoteId(null)
    setForm(EMPTY_FORM)
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  function login(event) {
    event.preventDefault()
    setCurrentUser(loginName.trim())
    setEditingNoteId(null)
    setErrorMessage('')
  }

  function logout() {
    setCurrentUser('')
    setLoginName('')
    resetForm()
  }

  function requestOptions(options = {}) {
    const headers = { ...(options.headers || {}) }
    if (currentUser) {
      headers['X-User'] = currentUser
    }

    return { ...options, headers }
  }

  async function saveNote(event) {
    event.preventDefault()

    if (!currentUser) {
      setErrorMessage('Log in before saving notes.')
      return
    }

    if (!form.title.trim() && !form.content.trim()) {
      setErrorMessage('Write a title or content before saving.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    const endpoint = isEditing ? `${NOTES_ENDPOINT}/${editingNoteId}` : NOTES_ENDPOINT
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(endpoint, requestOptions({
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }))

      if (!response.ok) {
        throw new Error('Note could not be saved.')
      }

      const savedNote = await response.json()
      setNotes((currentNotes) => {
        if (isEditing) {
          return currentNotes.map((note) => (note.id === savedNote.id ? savedNote : note))
        }

        return [savedNote, ...currentNotes]
      })
      resetForm()
    } catch {
      setErrorMessage('The note could not be saved.')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteNote(noteId) {
    setErrorMessage('')

    try {
      const response = await fetch(`${NOTES_ENDPOINT}/${noteId}`, requestOptions({ method: 'DELETE' }))

      if (!response.ok) {
        throw new Error('Note could not be deleted.')
      }

      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId))
      if (editingNoteId === noteId) {
        resetForm()
      }
    } catch {
      setErrorMessage('The note could not be deleted.')
    }
  }

  return (
    <main className={`min-h-screen px-4 py-8 sm:px-6 ${isDark ? 'bg-stone-900 text-stone-100' : 'bg-stone-100 text-zinc-950'}`}>
      <div className="mx-auto max-w-6xl">
        <header className={`mb-8 flex flex-col gap-5 border-b pb-6 ${isDark ? 'border-stone-700' : 'border-stone-300'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                aria-hidden="true"
                className={`mt-1 flex size-11 shrink-0 items-center justify-center rounded-md border ${
                  isDark ? 'border-teal-300/40 bg-teal-950/50 text-teal-100' : 'border-teal-200 bg-teal-50 text-teal-700'
                }`}
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24">
                  <path d="M7 3.75h9.25A2.75 2.75 0 0 1 19 6.5v11A2.75 2.75 0 0 1 16.25 20.25H7A2 2 0 0 1 5 18.25V5.75a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  <path d="M8 3.75v16.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-teal-200' : 'text-teal-700'}`}>Codex Notes Board</p>
                <h1 className="mt-2 text-3xl font-semibold">Notes</h1>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <form className="flex flex-wrap gap-2" onSubmit={login}>
                <input aria-label="Username" className={`w-40 rounded-md border px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200 ${isDark ? 'border-stone-600 bg-stone-800 text-stone-100 placeholder:text-stone-500' : 'border-stone-300 bg-stone-50 text-zinc-950'}`} onChange={(event) => setLoginName(event.target.value)} placeholder="Username" type="text" value={loginName} />
                <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800" type="submit">Log in</button>
                {currentUser && <button className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${isDark ? 'border-stone-500 text-stone-100 hover:bg-stone-800' : 'border-stone-400 text-stone-800 hover:bg-stone-200'}`} onClick={logout} type="button">Log out</button>}
              </form>
              <p className={`text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>{currentUser ? `Logged in as ${currentUser}` : 'Viewing public notes'}</p>
              <button className={`w-fit rounded-md border px-4 py-2 text-sm font-semibold transition ${isDark ? 'border-stone-500 text-stone-100 hover:bg-stone-800' : 'border-stone-400 text-stone-800 hover:bg-stone-200'}`} onClick={toggleTheme} type="button">
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={isDark ? 'text-stone-300' : 'text-stone-600'}>{noteCountLabel}</span>
            {PRIORITY_OPTIONS.map((priority) => {
              const priorityStyle = PRIORITIES[priority]
              return <span className={`rounded-md border px-2 py-1 font-semibold ${isDark ? priorityStyle.darkBadge : priorityStyle.badge}`} key={priority}>{priority}: {priorityCounts[priority] || 0}</span>
            })}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form className={`rounded-lg border p-5 shadow-sm ${isDark ? 'border-stone-700 bg-stone-800' : 'border-stone-300 bg-stone-50'}`} onSubmit={saveNote}>
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit note' : 'New note'}</h2>
            <label className={`mt-5 block text-sm font-medium ${isDark ? 'text-stone-200' : 'text-zinc-700'}`} htmlFor="title">Title</label>
            <input className={`mt-2 w-full rounded-md border px-3 py-2 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200 ${isDark ? 'border-stone-600 bg-stone-900 text-stone-100 placeholder:text-stone-500' : 'border-stone-300 bg-white text-zinc-950'}`} id="title" name="title" onChange={updateField} placeholder="Weekly plan" type="text" value={form.title} />

            <label className={`mt-4 block text-sm font-medium ${isDark ? 'text-stone-200' : 'text-zinc-700'}`} htmlFor="content">Content</label>
            <textarea className={`mt-2 min-h-40 w-full resize-y rounded-md border px-3 py-2 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200 ${isDark ? 'border-stone-600 bg-stone-900 text-stone-100 placeholder:text-stone-500' : 'border-stone-300 bg-white text-zinc-950'}`} id="content" name="content" onChange={updateField} placeholder="Write a short note..." value={form.content} />

            <label className={`mt-4 block text-sm font-medium ${isDark ? 'text-stone-200' : 'text-zinc-700'}`} htmlFor="priority">Priority</label>
            <select className={`mt-2 w-full rounded-md border px-3 py-2 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200 ${isDark ? 'border-stone-600 bg-stone-900 text-stone-100' : 'border-stone-300 bg-white text-zinc-950'}`} id="priority" name="priority" onChange={updateField} value={form.priority}>
              {PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>

            <label className={`mt-4 block text-sm font-medium ${isDark ? 'text-stone-200' : 'text-zinc-700'}`} htmlFor="visibility">Visibility</label>
            <select className={`mt-2 w-full rounded-md border px-3 py-2 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200 ${isDark ? 'border-stone-600 bg-stone-900 text-stone-100' : 'border-stone-300 bg-white text-zinc-950'}`} id="visibility" name="visibility" onChange={updateField} value={form.visibility}>
              {VISIBILITY_OPTIONS.map((visibility) => <option key={visibility} value={visibility}>{visibility === 'PUBLIC' ? 'Public' : 'Private'}</option>)}
            </select>

            {errorMessage && <p className="mt-4 rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-800">{errorMessage}</p>}

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-400" disabled={isSaving || !currentUser} type="submit">
                {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create note'}
              </button>
              {isEditing && <button className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${isDark ? 'border-stone-500 text-stone-100 hover:bg-stone-700' : 'border-stone-300 text-zinc-700 hover:bg-stone-200'}`} onClick={resetForm} type="button">Cancel</button>}
            </div>
          </form>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-stone-200' : 'text-zinc-700'}`} htmlFor="note-search">Search notes</label>
            <input className={`mt-2 w-full rounded-md border px-3 py-2 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200 ${isDark ? 'border-stone-600 bg-stone-800 text-stone-100 placeholder:text-stone-500' : 'border-stone-300 bg-stone-50 text-zinc-950'}`} id="note-search" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title or content..." type="search" value={searchTerm} />

            <div className="mt-4">
              {isLoading ? (
                <p className={`rounded-lg border p-5 ${isDark ? 'border-stone-700 bg-stone-800 text-stone-300' : 'border-stone-300 bg-stone-50 text-zinc-600'}`}>Loading notes...</p>
              ) : notes.length === 0 ? (
                <p className={`rounded-lg border border-dashed p-8 text-center ${isDark ? 'border-stone-600 bg-stone-800 text-stone-300' : 'border-stone-300 bg-stone-50 text-zinc-600'}`}>No notes yet. Create the first one.</p>
              ) : filteredNotes.length === 0 ? (
                <p className={`rounded-lg border border-dashed p-8 text-center ${isDark ? 'border-stone-600 bg-stone-800 text-stone-300' : 'border-stone-300 bg-stone-50 text-zinc-600'}`}>No notes match your search.</p>
              ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                  {filteredNotes.map((note) => {
                    const priority = PRIORITIES[note.priority] || PRIORITIES[DEFAULT_PRIORITY]
                    const visibilityLabel = note.visibility === 'PRIVATE' ? 'Private' : 'Public'
                    const canEdit = currentUser && note.owner === currentUser

                    return (
                      <li className={`rounded-lg border p-5 shadow-sm ${isDark ? priority.darkCard : priority.lightCard}`} key={note.id}>
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="break-words text-xl font-semibold">{note.title || 'Untitled note'}</h2>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${isDark ? priority.darkBadge : priority.badge}`}>{priority.label}</span>
                            <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${isDark ? 'border-stone-500 bg-stone-800 text-stone-100' : 'border-stone-300 bg-white text-stone-700'}`}>{visibilityLabel}</span>
                          </div>
                        </div>
                        <p className={`mt-3 text-xs font-semibold ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Created by {note.owner || 'Unknown'}</p>
                        <p className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 ${isDark ? 'text-stone-200' : 'text-zinc-700'}`}>{note.content || 'No content'}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <button className={`rounded-md border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-teal-300 text-teal-100 hover:bg-teal-950/60' : 'border-teal-700 text-teal-700 hover:bg-teal-50'}`} disabled={!canEdit} onClick={() => startEditing(note)} type="button">Edit</button>
                          <button className={`rounded-md border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-red-300 text-red-100 hover:bg-red-950/60' : 'border-red-300 text-red-700 hover:bg-red-50'}`} disabled={!canEdit} onClick={() => deleteNote(note.id)} type="button">Delete</button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
