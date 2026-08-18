import { useState } from "react";
import AuditLogTable from "./AuditLogTable";

function AuditLogSection({ auditLogs }) {
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [selectedPerformedBy, setSelectedPerformedBy] = useState("");

  const actions = [...new Set(auditLogs.map((auditLog) => auditLog.action))];
  const entityTypes = [...new Set(auditLogs.map((auditLog) => auditLog.entityType))];
  const performedByUsers = [...new Set(auditLogs.map((auditLog) => auditLog.performedBy))];

  const filteredAuditLogs = auditLogs.filter((auditLog) => {
    const matchesAction =
      selectedAction === "" || auditLog.action === selectedAction;

    const matchesEntityType =
      selectedEntityType === "" ||
      auditLog.entityType === selectedEntityType;

    const matchesPerformedBy =
      selectedPerformedBy === "" ||
      auditLog.performedBy === selectedPerformedBy;

    return matchesAction && matchesEntityType && matchesPerformedBy;
  });

  function clearFilters() {
    setSelectedAction("");
    setSelectedEntityType("");
    setSelectedPerformedBy("");
  }

  return (
    <>
      <h2>Audit Logs</h2>

      <div>
        <label>Filter by action: </label>

        <select
          value={selectedAction}
          onChange={(event) => setSelectedAction(event.target.value)}
        >
          <option value="">All actions</option>

          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by entity type: </label>

        <select
          value={selectedEntityType}
          onChange={(event) => setSelectedEntityType(event.target.value)}
        >
          <option value="">All entity types</option>

          {entityTypes.map((entityType) => (
            <option key={entityType} value={entityType}>
              {entityType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by performed by: </label>

        <select
          value={selectedPerformedBy}
          onChange={(event) => setSelectedPerformedBy(event.target.value)}
        >
          <option value="">All users</option>

          {performedByUsers.map((performedBy) => (
            <option key={performedBy} value={performedBy}>
              {performedBy}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={clearFilters}>
        Clear Audit Filters
      </button>

      <AuditLogTable
        auditLogs={filteredAuditLogs}
        emptyMessage="No audit logs match the selected filters."
      />
    </>
  );
}

export default AuditLogSection;