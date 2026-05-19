package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(t.dueDate >= :dueDateStart) AND " +
           "(t.dueDate <= :dueDateEnd)")
    Page<Task> findTasksWithFilters(
            @Param("user") User user,
            @Param("search") String search,
            @Param("priority") String priority,
            @Param("status") String status,
            @Param("dueDateStart") LocalDateTime dueDateStart,
            @Param("dueDateEnd") LocalDateTime dueDateEnd,
            Pageable pageable
    );

    long countByUser(User user);
    long countByUserAndStatus(User user, String status);
    long countByUserAndPriority(User user, String priority);
}
