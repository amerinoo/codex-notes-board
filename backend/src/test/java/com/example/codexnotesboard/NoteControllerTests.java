package com.example.codexnotesboard;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class NoteControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NoteRepository noteRepository;

    @BeforeEach
    void setUp() {
        noteRepository.deleteAll();
    }

    @Test
    void createsAndListsNotes() throws Exception {
        mockMvc.perform(post("/api/notes")
                        .header("X-User", "alice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": " Demo note ",
                                  "content": " First note ",
                                  "priority": "Alta",
                                  "visibility": "PUBLIC"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Demo note"))
                .andExpect(jsonPath("$.content").value("First note"))
                .andExpect(jsonPath("$.priority").value("Alta"))
                .andExpect(jsonPath("$.visibility").value("PUBLIC"))
                .andExpect(jsonPath("$.owner").value("alice"));

        mockMvc.perform(get("/api/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Demo note"))
                .andExpect(jsonPath("$[0].priority").value("Alta"));
    }

    @Test
    void requiresUserWhenCreatingNote() throws Exception {
        mockMvc.perform(post("/api/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Private",
                                  "content": "Content"
                                }
                                """))
                .andExpect(status().isNotFound());
    }

    @Test
    void capitalizesFirstContentLetterWhenCreatingNote() throws Exception {
        mockMvc.perform(post("/api/notes")
                        .header("X-User", "alice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Demo note",
                                  "content": " first note"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("First note"));
    }

    @Test
    void defaultsMissingAndInvalidPriorityToMedia() throws Exception {
        mockMvc.perform(post("/api/notes")
                        .header("X-User", "alice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Default priority",
                                  "content": "Content"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.priority").value("Media"));

        mockMvc.perform(post("/api/notes")
                        .header("X-User", "alice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Invalid priority",
                                  "content": "Content",
                                  "priority": "Critical"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.priority").value("Media"));
    }

    @Test
    void updatesExistingOwnedNote() throws Exception {
        createNote("alice", "Original", "Content", "PUBLIC");

        mockMvc.perform(put("/api/notes/1")
                        .header("X-User", "alice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated",
                                  "content": "changed content",
                                  "priority": "Baja",
                                  "visibility": "PRIVATE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Updated"))
                .andExpect(jsonPath("$.content").value("changed content"))
                .andExpect(jsonPath("$.priority").value("Baja"))
                .andExpect(jsonPath("$.visibility").value("PRIVATE"));
    }

    @Test
    void listsPublicNotesAndOwnPrivateNotesOnly() throws Exception {
        createNote("alice", "Alice private", "Content", "PRIVATE");
        createNote("alice", "Alice public", "Content", "PUBLIC");
        createNote("bob", "Bob private", "Content", "PRIVATE");
        createNote("bob", "Bob public", "Content", "PUBLIC");

        mockMvc.perform(get("/api/notes").header("X-User", "alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[?(@.title == 'Alice private')]").exists())
                .andExpect(jsonPath("$[?(@.title == 'Alice public')]").exists())
                .andExpect(jsonPath("$[?(@.title == 'Bob public')]").exists())
                .andExpect(jsonPath("$[?(@.title == 'Bob private')]").doesNotExist());

        mockMvc.perform(get("/api/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.title == 'Alice public')]").exists())
                .andExpect(jsonPath("$[?(@.title == 'Bob public')]").exists())
                .andExpect(jsonPath("$[?(@.title == 'Alice private')]").doesNotExist());
    }

    @Test
    void returnsNotFoundWhenUpdatingAnotherUsersNote() throws Exception {
        createNote("alice", "Alice private", "Content", "PRIVATE");

        mockMvc.perform(put("/api/notes/1")
                        .header("X-User", "bob")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated",
                                  "content": "changed content"
                                }
                                """))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletesOwnedNoteAndHidesOthersWithNotFound() throws Exception {
        createNote("alice", "Alice private", "Content", "PRIVATE");

        mockMvc.perform(delete("/api/notes/1").header("X-User", "bob"))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/notes/1").header("X-User", "alice"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/notes").header("X-User", "alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void returnsNotFoundWhenUpdatingMissingNote() throws Exception {
        mockMvc.perform(put("/api/notes/99")
                        .header("X-User", "alice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Missing",
                                  "content": "Missing content"
                                }
                                """))
                .andExpect(status().isNotFound());
    }

    @Test
    void returnsNotFoundWhenDeletingMissingNote() throws Exception {
        mockMvc.perform(delete("/api/notes/99").header("X-User", "alice"))
                .andExpect(status().isNotFound());
    }

    private void createNote(String owner, String title, String content, String visibility) throws Exception {
        mockMvc.perform(post("/api/notes")
                        .header("X-User", owner)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "%s",
                                  "content": "%s",
                                  "visibility": "%s"
                                }
                                """.formatted(title, content, visibility)))
                .andExpect(status().isOk());
    }
}
