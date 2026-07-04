package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.AppUser;
import com.yb.SyncERPal.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }
}
