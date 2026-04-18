package com.example.codexnotesboard;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NoteServiceTests {

    private NoteRepository noteRepository;
    private NoteService noteService;

    @BeforeEach
    void setUp() {
        noteRepository = new NoteRepository();
        noteService = new NoteService(noteRepository);
    }

    @Test
    void createRequiresUser() {
        Optional<Note> created = noteService.create(new NoteRequest("Title", "Content", "Alta", "PUBLIC"), " ");

        assertThat(created).isEmpty();
        assertThat(noteRepository.findAll()).isEmpty();
    }

    @Test
    void createCleansAndDefaultsNoteFields() {
        Note note = noteService.create(new NoteRequest(" Demo ", " first note", "critical", "secret"), " alice ")
                .orElseThrow();

        assertThat(note.getTitle()).isEqualTo("Demo");
        assertThat(note.getContent()).isEqualTo("First note");
        assertThat(note.getPriority()).isEqualTo("Media");
        assertThat(note.getVisibility()).isEqualTo("PUBLIC");
        assertThat(note.getOwner()).isEqualTo("alice");
        assertThat(note.getCreatedAt()).isNotNull();
        assertThat(note.getUpdatedAt()).isEqualTo(note.getCreatedAt());
    }

    @Test
    void createKeepsAllowedPriorityAndPrivateVisibility() {
        Note high = noteService.create(new NoteRequest("High", "content", "alta", "private"), "alice")
                .orElseThrow();
        Note low = noteService.create(new NoteRequest("Low", "content", "baja", "PRIVATE"), "alice")
                .orElseThrow();

        assertThat(high.getPriority()).isEqualTo("Alta");
        assertThat(high.getVisibility()).isEqualTo("PRIVATE");
        assertThat(low.getPriority()).isEqualTo("Baja");
        assertThat(low.getVisibility()).isEqualTo("PRIVATE");
    }

    @Test
    void findAllReturnsPublicNotesAndOwnPrivateNotes() {
        noteService.create(new NoteRequest("Alice private", "content", "Media", "PRIVATE"), "alice");
        noteService.create(new NoteRequest("Alice public", "content", "Media", "PUBLIC"), "alice");
        noteService.create(new NoteRequest("Bob private", "content", "Media", "PRIVATE"), "bob");
        noteService.create(new NoteRequest("Bob public", "content", "Media", "PUBLIC"), "bob");

        List<String> anonymousTitles = noteService.findAll(null).stream().map(Note::getTitle).toList();
        List<String> aliceTitles = noteService.findAll("alice").stream().map(Note::getTitle).toList();

        assertThat(anonymousTitles).containsExactlyInAnyOrder("Alice public", "Bob public");
        assertThat(aliceTitles).containsExactlyInAnyOrder("Alice private", "Alice public", "Bob public");
    }

    @Test
    void updateRequiresOwnerAndCleansEditableFields() {
        Note created = noteService.create(new NoteRequest("Original", "content", "Media", "PUBLIC"), "alice")
                .orElseThrow();

        assertThat(noteService.update(created.getId(), new NoteRequest("Bob edit", "content", "Alta", "PRIVATE"), "bob"))
                .isEmpty();

        Note updated = noteService.update(created.getId(), new NoteRequest(" Updated ", " changed", "Baja", "PRIVATE"), " alice ")
                .orElseThrow();

        assertThat(updated.getTitle()).isEqualTo("Updated");
        assertThat(updated.getContent()).isEqualTo("changed");
        assertThat(updated.getPriority()).isEqualTo("Baja");
        assertThat(updated.getVisibility()).isEqualTo("PRIVATE");
        assertThat(updated.getOwner()).isEqualTo("alice");
    }

    @Test
    void updateRejectsMissingUserAndMissingNote() {
        NoteRequest request = new NoteRequest("Updated", "content", "Alta", "PUBLIC");

        assertThat(noteService.update(42L, request, "alice")).isEmpty();

        Note created = noteService.create(new NoteRequest("Original", "content", "Media", "PUBLIC"), "alice")
                .orElseThrow();

        assertThat(noteService.update(created.getId(), request, null)).isEmpty();
    }

    @Test
    void deleteRequiresOwner() {
        Note created = noteService.create(new NoteRequest("Original", "content", "Media", "PRIVATE"), "alice")
                .orElseThrow();

        assertThat(noteService.delete(created.getId(), null)).isFalse();
        assertThat(noteService.delete(created.getId(), "bob")).isFalse();
        assertThat(noteRepository.findById(created.getId())).isPresent();

        assertThat(noteService.delete(created.getId(), " alice ")).isTrue();
        assertThat(noteRepository.findById(created.getId())).isEmpty();
    }
}
