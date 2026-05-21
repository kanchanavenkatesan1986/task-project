package com.taskmanager.controller;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.entity.User;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dueDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(taskService.getTasks(user, search, priority, status, dueDate, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(taskService.getTaskById(user, id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskDTO taskDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(user, taskDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO
    ) {
        return ResponseEntity.ok(taskService.updateTask(user, id, taskDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        taskService.deleteTask(user, id);
        return ResponseEntity.noContent().build();
    }
}
