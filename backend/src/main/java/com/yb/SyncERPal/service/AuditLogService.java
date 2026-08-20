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
        return createAuditLog(action, entityType, entityId, message, "system");
    }

    public AuditLog createAuditLog(
            String action,
            String entityType,
            Long entityId,
            String message,
            String performedBy
    ) {
        if (performedBy == null || performedBy.isBlank()) {
            performedBy = "system";
        }

        AuditLog auditLog = new AuditLog(action, entityType, entityId, message, performedBy);

        return auditLogRepository.save(auditLog);
    }

    public String exportAuditLogsAsCsv() {
        StringBuilder csv = new StringBuilder();

        csv.append("id,action,entityType,entityId,message,performedBy,createdAt\n");

        for (AuditLog auditLog : getAllAuditLogs()) {
            csv.append(auditLog.getId()).append(",");
            csv.append(escapeCsv(auditLog.getAction())).append(",");
            csv.append(escapeCsv(auditLog.getEntityType())).append(",");
            csv.append(auditLog.getEntityId()).append(",");
            csv.append(escapeCsv(auditLog.getMessage())).append(",");
            csv.append(escapeCsv(auditLog.getPerformedBy())).append(",");
            csv.append(auditLog.getCreatedAt()).append("\n");
        }

        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }

        String escapedValue = value.replace("\"", "\"\"");

        if (escapedValue.contains(",") || escapedValue.contains("\"") || escapedValue.contains("\n")) {
            return "\"" + escapedValue + "\"";
        }

        return escapedValue;
    }
}