package com.yb.SyncERPal.service;

import com.yb.SyncERPal.model.AuditLog;
import com.yb.SyncERPal.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    public AuditLog createAuditLog(String action, String entityType, Long entityId, String message) {
        AuditLog auditLog = new AuditLog(action, entityType, entityId, message);

        return auditLogRepository.save(auditLog);
    }
}