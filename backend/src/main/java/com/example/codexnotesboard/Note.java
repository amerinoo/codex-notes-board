package com.example.codexnotesboard;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Note {

    private Long id;
    private String title;
    private String content;
    private String priority;
    private String visibility;
    private String owner;
    private Instant createdAt;
    private Instant updatedAt;
}
