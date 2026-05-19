package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Page<TaskDTO> getTasks(
            User user,
            String search,
            String priority,
            String status,
            String dueDate,
            Pageable pageable
    ) {
        LocalDateTime startOfDay = LocalDateTime.of(1970, 1, 1, 0, 0);
        LocalDateTime endOfDay = LocalDateTime.of(9999, 12, 31, 23, 59, 59);

        if (dueDate != null && !dueDate.trim().isEmpty()) {
            try {
                LocalDate date = LocalDate.parse(dueDate, DateTimeFormatter.ISO_LOCAL_DATE);
                startOfDay = date.atStartOfDay();
                endOfDay = date.atTime(LocalTime.MAX);
            } catch (Exception e) {
                // If parsing fails, fall back to full range
            }
        }

        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String priorityParam = (priority != null && !priority.trim().isEmpty() && !priority.equalsIgnoreCase("ALL")) ? priority.toUpperCase() : null;
        String statusParam = (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) ? status.toUpperCase() : null;

        Page<Task> taskPage = taskRepository.findTasksWithFilters(
                user,
                searchParam,
                priorityParam,
                statusParam,
                startOfDay,
                endOfDay,
                pageable
        );

        return taskPage.map(this::convertToDTO);
    }

    public TaskDTO getTaskById(User user, Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not have permission to access this task");
        }

        return convertToDTO(task);
    }

    @Transactional
    public TaskDTO createTask(User user, TaskDTO taskDTO) {
        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .priority(taskDTO.getPriority().toUpperCase())
                .status(taskDTO.getStatus().toUpperCase())
                .dueDate(taskDTO.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }

    @Transactional
    public TaskDTO updateTask(User user, Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not have permission to update this task");
        }

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPriority(taskDTO.getPriority().toUpperCase());
        task.setStatus(taskDTO.getStatus().toUpperCase());
        task.setDueDate(taskDTO.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    @Transactional
    public void deleteTask(User user, Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    private TaskDTO convertToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
