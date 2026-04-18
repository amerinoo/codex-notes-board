import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

const notes = [
  { id: 1, title: 'Release plan', content: 'Ship the board update', priority: 'Alta' },
  { id: 2, title: 'Ideas', content: 'Search polish', priority: 'Media' },
  { id: 3, title: 'Archive', content: 'Old reference', priority: 'Baja' },
  { id: 4, title: 'Retro', content: 'Missing priority fallback' },
]

function mockNotesApi(responseNotes = notes) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => responseNotes,
  })
}

async function renderLoadedApp(responseNotes = notes) {
  mockNotesApi(responseNotes)
  render(<App />)
  await screen.findByText('Release plan')
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

  test('uses priority fallback when editing a note without priority', async () => {
    const user = userEvent.setup()
    await renderLoadedApp()

    const retroCard = screen.getByText('Retro').closest('li')
    await user.click(within(retroCard).getByRole('button', { name: 'Edit' }))

    expect(screen.getByLabelText('Priority')).toHaveValue('Media')
  })
})
