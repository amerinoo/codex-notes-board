package com.example.codexnotesboard;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private static final String PUBLIC = "PUBLIC";
    private static final String PRIVATE = "PRIVATE";

    private final NoteRepository noteRepository;
    private final Clock clock;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
        this.clock = Clock.systemUTC();
    }

    public List<Note> findAll(String currentUser) {
        String user = clean(currentUser);
        return noteRepository.findAll().stream()
                .filter(note -> isPublic(note) || isOwner(note, user))
                .toList();
    }

    public Optional<Note> create(NoteRequest request, String currentUser) {
        String owner = clean(currentUser);
        if (owner.isEmpty()) {
            return Optional.empty();
        }

        Instant now = Instant.now(clock);
        return Optional.of(noteRepository.save(new Note(
                null,
                clean(request.title()),
                capitalizeFirstLetter(clean(request.content())),
                cleanPriority(request.priority()),
                cleanVisibility(request.visibility()),
                owner,
                now,
                now)));
    }

    public Optional<Note> update(Long id, NoteRequest request, String currentUser) {
        String user = clean(currentUser);
        if (user.isEmpty()) {
            return Optional.empty();
        }

        return noteRepository.findById(id)
                .filter(existing -> isOwner(existing, user))
                .map(existing -> {
                    existing.setTitle(clean(request.title()));
                    existing.setContent(clean(request.content()));
                    existing.setPriority(cleanPriority(request.priority()));
                    existing.setVisibility(cleanVisibility(request.visibility()));
                    existing.setUpdatedAt(Instant.now(clock));
                    return noteRepository.save(existing);
                });
    }

    public boolean delete(Long id, String currentUser) {
        String user = clean(currentUser);
        if (user.isEmpty()) {
            return false;
        }

        return noteRepository.findById(id)
                .filter(existing -> isOwner(existing, user))
                .map(existing -> noteRepository.deleteById(id))
                .orElse(false);
    }

    private boolean isPublic(Note note) {
        return PUBLIC.equals(note.getVisibility());
    }

    private boolean isOwner(Note note, String currentUser) {
        return !currentUser.isEmpty() && note.getOwner().equals(currentUser);
    }

    private String cleanPriority(String value) {
        String cleaned = clean(value);
        if (cleaned.equalsIgnoreCase("Alta")) {
            return "Alta";
        }
        if (cleaned.equalsIgnoreCase("Baja")) {
            return "Baja";
        }
        return "Media";
    }

    private String cleanVisibility(String value) {
        String cleaned = clean(value);
        if (cleaned.equalsIgnoreCase(PRIVATE)) {
            return PRIVATE;
        }
        return PUBLIC;
    }

    private String capitalizeFirstLetter(String value) {
        if (value.isEmpty()) {
            return value;
        }

        char firstCharacter = value.charAt(0);
        if (!Character.isLowerCase(firstCharacter)) {
            return value;
        }

        return Character.toUpperCase(firstCharacter) + value.substring(1);
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
