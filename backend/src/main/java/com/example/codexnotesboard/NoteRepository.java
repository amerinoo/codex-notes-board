package com.example.codexnotesboard;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

@Repository
public class NoteRepository {

    private final ConcurrentMap<Long, Note> notes = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public List<Note> findAll() {
        return notes.values().stream()
                .sorted(Comparator.comparing(Note::getCreatedAt).reversed())
                .map(this::copy)
                .toList();
    }

    public Note save(Note note) {
        Long id = note.getId() == null ? nextId.getAndIncrement() : note.getId();
        Note saved = new Note(id, note.getTitle(), note.getContent(), note.getPriority(), note.getCreatedAt(), note.getUpdatedAt());
        notes.put(id, saved);
        return copy(saved);
    }

    public Optional<Note> findById(Long id) {
        return Optional.ofNullable(notes.get(id)).map(this::copy);
    }

    public boolean deleteById(Long id) {
        return notes.remove(id) != null;
    }

    public void deleteAll() {
        notes.clear();
        nextId.set(1);
    }

    private Note copy(Note note) {
        return new Note(note.getId(), note.getTitle(), note.getContent(), note.getPriority(), note.getCreatedAt(), note.getUpdatedAt());
    }
}
