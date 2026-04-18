package com.example.codexnotesboard;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NoteRepositoryTests {

    private NoteRepository noteRepository;

    @BeforeEach
    void setUp() {
        noteRepository = new NoteRepository();
    }

    @Test
    void assignsIdsAndReturnsNewestNotesFirst() {
        Note older = note("Older", Instant.parse("2026-04-18T10:00:00Z"));
        Note newer = note("Newer", Instant.parse("2026-04-18T11:00:00Z"));

        Note savedOlder = noteRepository.save(older);
        Note savedNewer = noteRepository.save(newer);

        List<Note> notes = noteRepository.findAll();

        assertThat(savedOlder.getId()).isEqualTo(1L);
        assertThat(savedNewer.getId()).isEqualTo(2L);
        assertThat(notes).extracting(Note::getTitle).containsExactly("Newer", "Older");
    }

    @Test
    void returnsDefensiveCopiesWhenSavingFindingAndListing() {
        Note saved = noteRepository.save(note("Original", Instant.parse("2026-04-18T10:00:00Z")));
        saved.setTitle("Mutated after save");

        Note found = noteRepository.findById(saved.getId()).orElseThrow();
        found.setTitle("Mutated after find");

        Note listed = noteRepository.findAll().getFirst();
        listed.setTitle("Mutated after list");

        assertThat(noteRepository.findById(saved.getId()).orElseThrow().getTitle()).isEqualTo("Original");
    }

    @Test
    void deleteAllClearsNotesAndResetsIds() {
        noteRepository.save(note("First", Instant.parse("2026-04-18T10:00:00Z")));

        noteRepository.deleteAll();
        Note savedAfterReset = noteRepository.save(note("Second", Instant.parse("2026-04-18T11:00:00Z")));

        assertThat(noteRepository.findAll()).hasSize(1);
        assertThat(savedAfterReset.getId()).isEqualTo(1L);
    }

    private Note note(String title, Instant createdAt) {
        return new Note(null, title, "Content", "Media", "PUBLIC", "alice", createdAt, createdAt);
    }
}
