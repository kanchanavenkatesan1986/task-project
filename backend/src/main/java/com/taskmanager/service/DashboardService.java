package com.taskmanager.service;

import com.taskmanager.dto.DashboardStatsDTO;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardStatsDTO getStats(User user) {
        long totalTasks = taskRepository.countByUser(user);
        long completedTasks = taskRepository.countByUserAndStatus(user, "COMPLETED");
        long pendingTasks = taskRepository.countByUserAndStatus(user, "PENDING");
        long highPriorityTasks = taskRepository.countByUserAndPriority(user, "HIGH");

        return DashboardStatsDTO.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .highPriorityTasks(highPriorityTasks)
                .build();
    }
}
