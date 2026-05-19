package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long highPriorityTasks;
}
