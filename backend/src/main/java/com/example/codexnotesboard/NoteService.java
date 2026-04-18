package com.example.codexnotesboard;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final Clock clock;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
        this.clock = Clock.systemUTC();
    }

    public List<Note> findAll() {
        return noteRepository.findAll();
    }

    public Note create(NoteRequest request) {
        Instant now = Instant.now(clock);
        return noteRepository.save(new Note(
                null,
                clean(request.title()),
                capitalizeFirstLetter(clean(request.content())),
                cleanPriority(request.priority()),
                now,
                now));
    }

    public Optional<Note> update(Long id, NoteRequest request) {
        return noteRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(clean(request.title()));
                    existing.setContent(clean(request.content()));
                    existing.setPriority(cleanPriority(request.priority()));
                    existing.setUpdatedAt(Instant.now(clock));
                    return noteRepository.save(existing);
                });
    }

    public boolean delete(Long id) {
        return noteRepository.deleteById(id);
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
