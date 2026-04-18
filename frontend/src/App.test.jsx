import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

const notes = [
  { id: 1, title: 'Release plan', content: 'Ship the board update', priority: 'Alta', visibility: 'PUBLIC', owner: 'alice' },
  { id: 2, title: 'Ideas', content: 'Search polish', priority: 'Media', visibility: 'PRIVATE', owner: 'alice' },
  { id: 3, title: 'Archive', content: 'Old reference', priority: 'Baja', visibility: 'PUBLIC', owner: 'bob' },
  { id: 4, title: 'Retro', content: 'Missing priority fallback', visibility: 'PUBLIC', owner: 'alice' },
]

function mockNotesApi(responseNotes = notes) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => responseNotes,
  })
}

async function renderLoadedApp(responseNotes = notes, expectedTitle = 'Release plan') {
  mockNotesApi(responseNotes)
  render(<App />)
  await screen.findByText(expectedTitle)
}

beforeEach(() => {
  mockNotesApi()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('App note logic', () => {
  test('shows priority counts for all fixed priorities', async () => {
    await renderLoadedApp()

    expect(screen.getByText('4 notes')).toBeInTheDocument()
    expect(screen.getByText('Alta: 1')).toBeInTheDocument()
    expect(screen.getByText('Media: 2')).toBeInTheDocument()
    expect(screen.getByText('Baja: 1')).toBeInTheDocument()
  })

  test('filters notes by title or content without changing priority counts', async () => {
    const user = userEvent.setup()
    await renderLoadedApp()

    await user.type(screen.getByLabelText('Search notes'), 'ship')

    expect(screen.getByText('Release plan')).toBeInTheDocument()
    expect(screen.queryByText('Ideas')).not.toBeInTheDocument()
    expect(screen.queryByText('Archive')).not.toBeInTheDocument()
    expect(screen.getByText('Alta: 1')).toBeInTheDocument()
    expect(screen.getByText('Media: 2')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search notes'))
    await user.type(screen.getByLabelText('Search notes'), 'ideas')

    expect(screen.getByText('Ideas')).toBeInTheDocument()
    expect(screen.queryByText('Release plan')).not.toBeInTheDocument()
  })

  test('shows a separate empty state for searches with no matches', async () => {
    const user = userEvent.setup()
    await renderLoadedApp()

    await user.type(screen.getByLabelText('Search notes'), 'nothing here')

    expect(screen.getByText('No notes match your search.')).toBeInTheDocument()
    expect(screen.queryByText('No notes yet. Create the first one.')).not.toBeInTheDocument()
  })

  test('toggles between dark and light mode', async () => {
    const user = userEvent.setup()
    await renderLoadedApp()

    const main = screen.getByRole('main')
    expect(main).toHaveClass('bg-stone-900')
    expect(screen.getByRole('button', { name: 'Light mode' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Light mode' }))

    expect(main).toHaveClass('bg-stone-100')
    expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument()
  })

  test('renders no-notes empty state when the API returns an empty list', async () => {
    mockNotesApi([])
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('No notes yet. Create the first one.')).toBeInTheDocument()
    })
  })

  test('shows visibility and owner labels', async () => {
    await renderLoadedApp()

    const releaseCard = screen.getByText('Release plan').closest('li')
    const ideasCard = screen.getByText('Ideas').closest('li')

    expect(within(releaseCard).getByText('Public')).toBeInTheDocument()
    expect(within(releaseCard).getByText('Created by alice')).toBeInTheDocument()
    expect(within(ideasCard).getByText('Private')).toBeInTheDocument()
  })

  test('uses logged-in user in request headers when loading and saving notes', async () => {
    const user = userEvent.setup()
    await renderLoadedApp()

    await user.type(screen.getByLabelText('Username'), 'alice')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:8080/api/notes', { headers: { 'X-User': 'alice' } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 5,
        title: 'Private draft',
        content: 'Secret',
        priority: 'Media',
        visibility: 'PRIVATE',
        owner: 'alice',
      }),
    })

    await user.type(screen.getByLabelText('Title'), 'Private draft')
    await user.selectOptions(screen.getByLabelText('Visibility'), 'PRIVATE')
    await user.click(screen.getByRole('button', { name: 'Create note' }))

    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://localhost:8080/api/notes',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User': 'alice' },
      }),
    )
  })

  test('uses priority and visibility fallback when editing a note without those fields', async () => {
    const user = userEvent.setup()
    await renderLoadedApp([{ id: 4, title: 'Retro', content: 'Missing fallback', owner: 'alice' }], 'Retro')

    await user.type(screen.getByLabelText('Username'), 'alice')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    const retroCard = await screen.findByText('Retro')
    await user.click(within(retroCard.closest('li')).getByRole('button', { name: 'Edit' }))

    expect(screen.getByLabelText('Priority')).toHaveValue('Media')
    expect(screen.getByLabelText('Visibility')).toHaveValue('PUBLIC')
  })
})
