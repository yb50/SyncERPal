import { useState } from "react";
import AuditLogTable from "./AuditLogTable";

function AuditLogSection({ auditLogs, exportAuditLogs }) {
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [selectedPerformedBy, setSelectedPerformedBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const actions = [...new Set(auditLogs.map((auditLog) => auditLog.action))];
  const entityTypes = [
    ...new Set(auditLogs.map((auditLog) => auditLog.entityType)),
  ];
  const performedByUsers = [
    ...new Set(auditLogs.map((auditLog) => auditLog.performedBy)),
  ];

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

  // + Pagination

  const totalPages = Math.ceil(filteredAuditLogs.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAuditLogs = filteredAuditLogs.slice(
    startIndex,
    startIndex + pageSize
  );

  function resetToFirstPage() {
    setCurrentPage(1);
  }
  
  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }
  
  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  // - Pagination
  
  function clearFilters() {
    setSelectedAction("");
    setSelectedEntityType("");
    setSelectedPerformedBy("");
    setCurrentPage(1);
  }

  return (
    <>
      <h2>Audit Logs</h2>

      <button type="button" onClick={exportAuditLogs}>
        Export Audit Logs CSV
      </button>

      <div>
        <label>Filter by action: </label>

        <select
          value={selectedAction}
          onChange={(event) => {
            setSelectedAction(event.target.value);
            resetToFirstPage();
          }}
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
          onChange={(event) => {
            setSelectedEntityType(event.target.value);
            resetToFirstPage();
          }}
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
          onChange={(event) => {
            setSelectedPerformedBy(event.target.value);
            resetToFirstPage();
          }}
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

      <p className="table-summary">
        Showing {paginatedAuditLogs.length} of {filteredAuditLogs.length} audit
        logs
      </p>

      <AuditLogTable
        auditLogs={paginatedAuditLogs}
        emptyMessage="No audit logs match the selected filters."
      />

      {filteredAuditLogs.length > 0 && (
        <div className="pagination">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default AuditLogSection;