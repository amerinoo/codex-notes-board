package com.example.codexnotesboard;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> findAll(@RequestHeader(value = "X-User", required = false) String currentUser) {
        return noteService.findAll(currentUser);
    }

    @PostMapping
    public ResponseEntity<Note> create(
            @RequestHeader(value = "X-User", required = false) String currentUser,
            @RequestBody NoteRequest request) {
        return noteService.create(request, currentUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> update(
            @PathVariable Long id,
            @RequestHeader(value = "X-User", required = false) String currentUser,
            @RequestBody NoteRequest request) {
        return noteService.update(id, request, currentUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader(value = "X-User", required = false) String currentUser) {
        return noteService.delete(id, currentUser)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
