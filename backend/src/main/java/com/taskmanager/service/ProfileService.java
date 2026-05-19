package com.taskmanager.service;

import com.taskmanager.dto.PasswordChangeDTO;
import com.taskmanager.dto.ProfileDTO;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileDTO getProfile(User user) {
        return new ProfileDTO(user.getFullName(), user.getEmail());
    }

    @Transactional
    public ProfileDTO updateProfile(User user, ProfileDTO profileDTO) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        existingUser.setFullName(profileDTO.getFullName());
        User savedUser = userRepository.save(existingUser);
        return new ProfileDTO(savedUser.getFullName(), savedUser.getEmail());
    }

    @Transactional
    public void changePassword(User user, PasswordChangeDTO dto) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), existingUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        existingUser.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(existingUser);
    }
}
