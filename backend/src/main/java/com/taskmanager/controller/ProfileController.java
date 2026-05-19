package com.taskmanager.controller;

import com.taskmanager.dto.PasswordChangeDTO;
import com.taskmanager.dto.ProfileDTO;
import com.taskmanager.entity.User;
import com.taskmanager.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getProfile(user));
    }

    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileDTO profileDTO
    ) {
        return ResponseEntity.ok(profileService.updateProfile(user, profileDTO));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PasswordChangeDTO passwordChangeDTO
    ) {
        profileService.changePassword(user, passwordChangeDTO);
        return ResponseEntity.ok().build();
    }
}
