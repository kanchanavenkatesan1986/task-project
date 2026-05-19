package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    private String description;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(HIGH|MEDIUM|LOW)$", message = "Priority must be HIGH, MEDIUM, or LOW")
    private String priority;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|COMPLETED)$", message = "Status must be PENDING or COMPLETED")
    private String status;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
