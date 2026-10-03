package com.yb.SyncERPal.repository;

import com.yb.SyncERPal.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuditLogRepository {

    private final AuditLogJpaRepository auditLogJpaRepository;

    public AuditLogRepository(AuditLogJpaRepository auditLogJpaRepository) {
        this.auditLogJpaRepository = auditLogJpaRepository;
    }

    public List<AuditLog> findAll() {
        return auditLogJpaRepository.findAllByOrderByCreatedAtDesc();
    }

    public AuditLog save(AuditLog auditLog) {
        return auditLogJpaRepository.save(auditLog);
    }

    public Page<AuditLog> findAll(Pageable pageable) {
        return auditLogJpaRepository.findAll(pageable);
    }
}