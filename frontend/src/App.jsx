import { useEffect, useMemo, useState } from 'react'

const NOTES_ENDPOINT = 'http://localhost:8080/api/notes'
const EMPTY_FORM = { title: '', content: '' }

function App() {
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  const isEditing = editingNoteId !== null
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
      const response = await fetch(NOTES_ENDPOINT)

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
    setForm({ title: note.title, content: note.content })
    setErrorMessage('')
  }

  function resetForm() {
    setEditingNoteId(null)
    setForm(EMPTY_FORM)
  }

  async function saveNote(event) {
    event.preventDefault()

    if (!form.title.trim() && !form.content.trim()) {
      setErrorMessage('Write a title or content before saving.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    const endpoint = isEditing ? `${NOTES_ENDPOINT}/${editingNoteId}` : NOTES_ENDPOINT
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

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
      const response = await fetch(`${NOTES_ENDPOINT}/${noteId}`, { method: 'DELETE' })

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
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Codex Notes Board</p>
            <h1 className="mt-2 text-3xl font-semibold">Notes</h1>
          </div>
          <p className="text-sm text-zinc-600">{noteCountLabel}</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm" onSubmit={saveNote}>
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit note' : 'New note'}</h2>
            <label className="mt-5 block text-sm font-medium text-zinc-700" htmlFor="title">
              Title
            </label>
            <input
              className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-base outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              id="title"
              name="title"
              onChange={updateField}
              placeholder="Weekly plan"
              type="text"
              value={form.title}
            />

            <label className="mt-4 block text-sm font-medium text-zinc-700" htmlFor="content">
              Content
            </label>
            <textarea
              className="mt-2 min-h-40 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-base outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              id="content"
              name="content"
              onChange={updateField}
              placeholder="Write a short note..."
              value={form.content}
            />

            {errorMessage && (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create note'}
              </button>
              {isEditing && (
                <button
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  onClick={resetForm}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div>
            {isLoading ? (
              <p className="rounded-lg border border-zinc-200 bg-white p-5 text-zinc-600">Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
                No notes yet. Create the first one.
              </p>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {notes.map((note) => (
                  <li className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm" key={note.id}>
                    <h2 className="break-words text-xl font-semibold">{note.title || 'Untitled note'}</h2>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-700">
                      {note.content || 'No content'}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        className="rounded-md border border-teal-700 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                        onClick={() => startEditing(note)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        onClick={() => deleteNote(note.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
